import React, { useState, useEffect } from 'react';
import { Plus, Settings, Cloud, LogOut, Users, FileText, Briefcase, LayoutGrid, Star, Handshake, Key } from 'lucide-react';
import { getGitHubConfig, saveGitHubConfigLocal, clearGitHubConfig, isGitHubConfigured, fetchSiteData, saveSiteData } from '../lib/github';
import { getImgBBKey, saveImgBBKey } from '../lib/imageUpload';
import { useData, serializeTeamMember, serializeProject, serializeService, serializeInsight, serializeJob, serializePartner } from '../contexts/DataContext';
import AdminHeader from './admin/AdminHeader';
import AdminSidebar from './admin/AdminSidebar';
import ContentGrid from './admin/ContentGrid';
import EditItemModal from './admin/EditItemModal';
import { TeamMember, Project, Post, Service, CurrentUser, Job, Partner, GitHubConfig } from '../types';
import { slugify } from '../utils/format';

interface AdminDashboardProps {
  onLogout: () => void;
  currentUser: CurrentUser;
  onViewSite: () => void;
}

type TabType = 'team' | 'projects' | 'insights' | 'services' | 'careers' | 'settings' | 'partners';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, currentUser, onViewSite }) => {
  const { isUsingSupabase, team = [], projects = [], insights = [], services: localServices = [], jobs = [], partners = [], updateTeamOrder, refreshData } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('team');
  const [ghConfig, setGhConfig] = useState<GitHubConfig | null>(getGitHubConfig());
  const [imgbbKey, setImgbbKey] = useState<string>(getImgBBKey() || '');
  
  // Data States (Local to Admin for immediate updates)
  const [adminTeam, setAdminTeam] = useState<TeamMember[]>(team);
  const [adminProjects, setAdminProjects] = useState<Project[]>(projects);
  const [adminInsights, setAdminInsights] = useState<Post[]>(insights);
  const [adminServices, setAdminServices] = useState<Service[]>(localServices);
  const [adminJobs, setAdminJobs] = useState<Job[]>(jobs);
  const [adminPartners, setAdminPartners] = useState<Partner[]>(partners);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Set initial tab based on role
  useEffect(() => {
      if (currentUser.role === 'member') {
          setActiveTab('team');
      } else {
          setActiveTab('insights');
      }
  }, [currentUser]);

  // Initialize: Load Config and Data
  useEffect(() => {
      setGhConfig(getGitHubConfig());
      setAdminTeam(team || []);
      setAdminProjects(projects || []);
      setAdminInsights(insights || []);
      setAdminServices(localServices || []);
      setAdminJobs(jobs || []);
      setAdminPartners(partners || []);
  }, [team, projects, insights, localServices, jobs, partners]);

  const handleGitHubConfigSave = (e: React.FormEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const cfg: GitHubConfig = {
          username: (form.querySelector('#ghUser') as HTMLInputElement).value.trim(),
          repo: (form.querySelector('#ghRepo') as HTMLInputElement).value.trim(),
          branch: (form.querySelector('#ghBranch') as HTMLInputElement).value.trim() || 'main',
          token: (form.querySelector('#ghToken') as HTMLInputElement).value.trim(),
      };
      saveGitHubConfigLocal(cfg);
      setGhConfig(cfg);
      window.location.reload();
  };

  const handleImgbbKeySave = (e: React.FormEvent) => {
      e.preventDefault();
      saveImgBBKey(imgbbKey);
      alert('Image upload key saved!');
  };

  const clearConfig = () => {
      if (window.confirm('Disconnect GitHub configuration?')) {
          clearGitHubConfig();
          window.location.reload();
      }
  };

  // CRUD Operations
  const handleEdit = (item: any) => {
    setIsAdding(false);
    // For services/partners/jobs, ensure icon is treated as string for editing if it's a component
    let itemToEdit = { ...item };
    if (activeTab === 'services' || activeTab === 'careers' || activeTab === 'partners') {
        if (item._iconString) {
            itemToEdit.icon = item._iconString;
        } else if (typeof item.icon !== 'string') {
            // Fallback for static items without _iconString, default to empty to allow editing
            itemToEdit.icon = ''; 
        }
        // Ensure image field exists even if empty, so the modal renders the uploader (for services/partners)
        if ((activeTab === 'services' || activeTab === 'partners') && !itemToEdit.image) {
            itemToEdit.image = '';
        }
    }
    setEditingItem(itemToEdit);
    setIsModalOpen(true);
  };

  const handleReorderTeam = async (newOrder: TeamMember[]) => {
      setAdminTeam(newOrder); // Optimistic local update
      await updateTeamOrder(newOrder); // Sync to DB
  };

  const handleAdd = () => {
    // Security check: Members cannot add UNLESS it's a Project or Insight (for themselves)
    // Projects are now allowed for everyone
    if ((currentUser.role as string) !== 'admin' && activeTab !== 'projects' && activeTab !== 'insights') {
        alert("You do not have permission to add new items in this section.");
        return;
    }

    setIsAdding(true);
    // Default Templates
    const templates: any = {
      team: { name: '', role: '', roleKm: '', image: '', bio: '', bioKm: '', skills: [], experience: [], socials: {}, pinCode: '1111' },
      projects: { title: '', category: 'graphicdesign', image: '', client: '', description: '', link: '', gallery: [], challenge: '', challengeKm: '', solution: '', solutionKm: '', result: '', resultKm: '' },
      insights: { title: '', titleKm: '', excerpt: '', content: '', date: new Date().toISOString().split('T')[0], category: 'Design', image: '', authorId: currentUser.role === 'member' ? currentUser.id : 't1' },
      services: { title: '', titleKm: '', subtitle: '', subtitleKm: '', description: '', descriptionKm: '', features: [], featuresKm: [], icon: 'Box', color: 'bg-indigo-500', image: '' },
      careers: { title: '', type: 'Full-time', location: 'Phnom Penh', department: 'Engineering', icon: 'Code', link: '', description: '' },
      partners: { name: '', icon: 'Building2', image: '' }
    };
    setEditingItem(templates[activeTab]);
    setIsModalOpen(true);
  };

  const handleDelete = async (type: string, id: string) => {
      const isSuperAdmin = currentUser.role === 'admin';
      
      if (type === 'project' && !isSuperAdmin) {
          const project = adminProjects.find(p => p.id === id);
          if (!project || project.createdBy !== currentUser.id) {
              alert("You can only delete projects that you added.");
              return;
          }
      }
      if (type === 'insight' && !isSuperAdmin) {
          const post = adminInsights.find(p => p.id === id);
          if (!post || post.authorId !== currentUser.id) {
              alert("You can only delete your own articles.");
              return;
          }
      }
      if ((type !== 'project' && type !== 'insight') && !isSuperAdmin) {
          alert("Only Admins can delete this item.");
          return;
      }

      if (!window.confirm("Are you sure you want to delete this item?")) return;

      const cfg = getGitHubConfig();
      if (!cfg) { alert("GitHub not configured."); return; }

      setIsSyncing(true);
      try {
          const data = await fetchSiteData(cfg);
          if (!data) throw new Error("Could not load site data");

          const tableMap: Record<string, keyof typeof data> = {
              team: 'team', project: 'projects', insight: 'insights',
              service: 'services', job: 'jobs', partner: 'partners',
          };
          const key = tableMap[type];
          if (key) {
              (data[key] as any[]) = (data[key] as any[]).filter((item: any) => item.id !== id);
          }

          await saveSiteData(cfg, data);

          const updater = (prev: any[]) => prev.filter(i => i.id !== id);
          if (type === 'team') setAdminTeam(updater);
          if (type === 'project') setAdminProjects(updater);
          if (type === 'insight') setAdminInsights(updater);
          if (type === 'service') setAdminServices(updater);
          if (type === 'job') setAdminJobs(updater);
          if (type === 'partner') setAdminPartners(updater);

          await refreshData();
          alert("Item deleted successfully!");
      } catch (err: any) {
          console.error(err);
          alert("Failed to delete: " + err.message);
      } finally {
          setIsSyncing(false);
      }
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      const cfg = getGitHubConfig();
      if (!cfg) { alert("GitHub not configured. Please set up in Settings."); return; }

      if (isAdding && (currentUser.role as string) !== 'admin' && activeTab !== 'projects' && activeTab !== 'insights') {
          alert("Security Alert: Only Admins can create new records in this section.");
          return;
      }

      setIsSaving(true);
      try {
          const data = await fetchSiteData(cfg);
          if (!data) throw new Error("Could not load current site data from GitHub");

          const item = { ...editingItem };
          const generatedSlug = item.slug || slugify(item.title || item.name || '');
          item.slug = generatedSlug;

          if (isAdding || !item.id) {
              item.id = (typeof crypto !== 'undefined' && crypto.randomUUID)
                  ? crypto.randomUUID()
                  : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
          }
          if (activeTab === 'projects' && isAdding) {
              item.createdBy = currentUser.id;
          }

          let serialized: any;
          let arrayKey: keyof typeof data;
          if (activeTab === 'projects')  { serialized = serializeProject({ ...item });  arrayKey = 'projects'; }
          else if (activeTab === 'services') { serialized = serializeService({ ...item }); arrayKey = 'services'; }
          else if (activeTab === 'team')    { serialized = serializeTeamMember({ ...item, orderIndex: isAdding ? (data.team || []).length : item.orderIndex }); arrayKey = 'team'; }
          else if (activeTab === 'insights') { serialized = serializeInsight({ ...item }); arrayKey = 'insights'; }
          else if (activeTab === 'careers') { serialized = serializeJob({ ...item }); arrayKey = 'jobs'; }
          else if (activeTab === 'partners') { serialized = serializePartner({ ...item }); arrayKey = 'partners'; }
          else throw new Error('Unknown tab');

          const arr: any[] = data[arrayKey] || [];
          const existingIdx = arr.findIndex((x: any) => x.id === item.id);
          if (existingIdx !== -1) {
              arr[existingIdx] = serialized;
          } else {
              arr.unshift(serialized);
          }
          data[arrayKey] = arr;

          await saveSiteData(cfg, data);

          const newItem = { ...item, ...serialized };
          const updater = (list: any[]) => {
              const idx = list.findIndex(i => i.id === item.id);
              if (idx !== -1) {
                  const copy = [...list];
                  copy[idx] = newItem;
                  return copy;
              }
              return [newItem, ...list];
          };

          if (activeTab === 'team') setAdminTeam(updater(adminTeam));
          if (activeTab === 'projects') setAdminProjects(updater(adminProjects));
          if (activeTab === 'insights') setAdminInsights(updater(adminInsights));
          if (activeTab === 'services') setAdminServices(updater(adminServices));
          if (activeTab === 'careers') setAdminJobs(updater(adminJobs));
          if (activeTab === 'partners') setAdminPartners(updater(adminPartners));

          await refreshData();
          setIsModalOpen(false);
          alert("Saved successfully!");
      } catch (err: any) {
          console.error(err);
          alert("Failed to save: " + err.message);
      } finally {
          setIsSaving(false);
      }
  };

  // Setup Screen: shown if GitHub is not yet configured
  if (!ghConfig) {
      return (
          <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6 relative">
               <div className="relative z-10 max-w-md w-full bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
                   <div className="flex items-center gap-3 mb-6">
                       <Cloud className="text-indigo-400" size={28} />
                       <div>
                           <h2 className="text-xl font-bold">Connect to GitHub</h2>
                           <p className="text-gray-400 text-sm">Data is stored in your repository's site-data.json</p>
                       </div>
                   </div>
                   <form onSubmit={handleGitHubConfigSave} className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label htmlFor="ghUser" className="block text-xs font-bold text-gray-500 mb-1">GitHub Username</label>
                               <input id="ghUser" type="text" className="w-full bg-gray-800 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="you2show" required />
                           </div>
                           <div>
                               <label htmlFor="ghRepo" className="block text-xs font-bold text-gray-500 mb-1">Repository Name</label>
                               <input id="ghRepo" type="text" className="w-full bg-gray-800 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="pcreative" required />
                           </div>
                       </div>
                       <div>
                           <label htmlFor="ghBranch" className="block text-xs font-bold text-gray-500 mb-1">Branch</label>
                           <input id="ghBranch" type="text" defaultValue="main" className="w-full bg-gray-800 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                       </div>
                       <div>
                           <label htmlFor="ghToken" className="block text-xs font-bold text-gray-500 mb-1">Personal Access Token (PAT)</label>
                           <input id="ghToken" type="password" className="w-full bg-gray-800 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ghp_..." required />
                           <p className="text-gray-500 text-xs mt-1">Needs <code>repo</code> scope. Get one at github.com/settings/tokens</p>
                       </div>
                       <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all font-khmer">
                           Connect
                       </button>
                   </form>
                   <button onClick={onLogout} className="absolute top-6 right-6 text-gray-500 hover:text-white flex items-center gap-2">Exit</button>
               </div>
          </div>
      );
  }

  const handleViewSite = () => {
      window.location.reload(); 
  };

  const MobileNavButton = ({ tab, icon: Icon, label }: { tab: TabType, icon: any, label: string }) => (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-[70px] ${activeTab === tab ? 'text-indigo-400 bg-white/5' : 'text-gray-500'}`}
      >
          <Icon size={20} />
          <span className="text-[10px] font-bold">{label}</span>
      </button>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
       <AdminHeader 
          currentUser={currentUser}
          isSuperAdmin={currentUser.role === 'admin'}
          lastSyncTime={null}
          isSyncing={isSyncing}
          syncStatus={null}
          onFetch={refreshData} // Allow manual refresh via header
          onSync={() => {}}
          onLogout={onLogout}
          onViewSite={handleViewSite}
       />

       {/* Mobile Navigation Bar */}
       <div className="md:hidden fixed top-16 left-0 right-0 h-16 bg-gray-900 border-b border-white/10 flex items-center px-4 overflow-x-auto gap-2 z-40 no-scrollbar">
           <MobileNavButton tab="team" icon={Users} label={currentUser.role === 'admin' ? "Team" : "Profile"} />
           <MobileNavButton tab="insights" icon={FileText} label="Articles" />
           <MobileNavButton tab="projects" icon={Briefcase} label="Projects" />
           
           {currentUser.role === 'admin' && (
             <>
                <MobileNavButton tab="services" icon={LayoutGrid} label="Services" />
                <MobileNavButton tab="careers" icon={Star} label="Careers" />
                <MobileNavButton tab="partners" icon={Handshake} label="Partners" />
                <MobileNavButton tab="settings" icon={Settings} label="Config" />
             </>
           )}
       </div>

       <div className="flex flex-1 pt-32 md:pt-16">
          <AdminSidebar 
             activeTab={activeTab}
             setActiveTab={setActiveTab}
             isSuperAdmin={currentUser.role === 'admin'}
          />

          <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-128px)] md:h-[calc(100vh-64px)]">
             <div className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                   <h1 className="text-2xl md:text-3xl font-bold font-khmer capitalize">{activeTab}</h1>
                   <p className="text-gray-400 text-xs md:text-sm">Manage your {activeTab} content directly.</p>
                </div>
                
                {/* Add New Button: Visible for Admins OR if on Projects Tab OR Insights Tab */}
                {activeTab !== 'settings' && (currentUser.role === 'admin' || activeTab === 'projects' || activeTab === 'insights') && (
                    <button 
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all font-khmer text-sm"
                    >
                        <Plus size={16} /> <span className="hidden md:inline">Add New</span><span className="md:hidden">Add</span>
                    </button>
                )}
             </div>

             {activeTab === 'settings' ? (
                 <div className="space-y-6 max-w-xl">
                     {/* GitHub Config */}
                     <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
                         <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Cloud size={20} className="text-indigo-400"/> GitHub Connection</h3>
                         <p className="text-gray-400 text-sm mb-4">Connected: <span className="text-green-400">{ghConfig?.username}/{ghConfig?.repo} @ {ghConfig?.branch}</span></p>
                         <form onSubmit={handleGitHubConfigSave} className="space-y-3">
                             <div className="grid grid-cols-2 gap-3">
                                 <div>
                                     <label className="block text-xs font-bold text-gray-500 mb-1">Username</label>
                                     <input id="ghUser" type="text" defaultValue={ghConfig?.username} className="w-full bg-gray-800 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
                                 </div>
                                 <div>
                                     <label className="block text-xs font-bold text-gray-500 mb-1">Repository</label>
                                     <input id="ghRepo" type="text" defaultValue={ghConfig?.repo} className="w-full bg-gray-800 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
                                 </div>
                             </div>
                             <div>
                                 <label htmlFor="ghBranch" className="block text-xs font-bold text-gray-500 mb-1">Branch</label>
                                 <input id="ghBranch" type="text" defaultValue={ghConfig?.branch || 'main'} className="w-full bg-gray-800 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                             </div>
                             <div>
                                 <label htmlFor="ghToken" className="block text-xs font-bold text-gray-500 mb-1">Personal Access Token</label>
                                 <input id="ghToken" type="password" defaultValue={ghConfig?.token} className="w-full bg-gray-800 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="ghp_..." required />
                             </div>
                             <div className="flex gap-3">
                                 <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold">Update Config</button>
                                 <button type="button" onClick={clearConfig} className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20 text-sm font-bold">Disconnect</button>
                             </div>
                         </form>
                     </div>
                     {/* Image Upload Config */}
                     <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
                         <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Key size={20} className="text-yellow-400"/> Image Upload (imgbb)</h3>
                         <p className="text-gray-400 text-sm mb-4">Images are uploaded to <a href="https://imgbb.com/signup" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">imgbb.com</a> (free). Paste your API key below.</p>
                         <form onSubmit={handleImgbbKeySave} className="space-y-3">
                             <input
                                 type="text"
                                 value={imgbbKey}
                                 onChange={e => setImgbbKey(e.target.value)}
                                 className="w-full bg-gray-800 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-yellow-500"
                                 placeholder="Paste imgbb API key here..."
                             />
                             <button type="submit" className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-bold">Save Key</button>
                         </form>
                     </div>
                 </div>
             ) : (
                 <ContentGrid 
                    activeTab={activeTab}
                    isSuperAdmin={currentUser.role === 'admin'}
                    memberId={currentUser.id}
                    data={{ team: adminTeam, projects: adminProjects, insights: adminInsights, services: adminServices, jobs: adminJobs, partners: adminPartners }}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onReorderTeam={handleReorderTeam}
                 />
             )}
          </main>
       </div>

       <EditItemModal 
          isOpen={isModalOpen}
          isAdding={isAdding}
          activeTab={activeTab}
          isSuperAdmin={currentUser.role === 'admin'}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          isSaving={isSaving}
          apiToken={null} 
       />
    </div>
  );
};

export default AdminDashboard;
