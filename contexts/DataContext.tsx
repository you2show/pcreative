import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SERVICES, PROJECTS, TEAM, INSIGHTS, JOBS, PARTNERS, TESTIMONIALS } from '../constants';
import { Service, Project, TeamMember, Post, Job, Partner, Testimonial } from '../types';
import { getSupabaseClient } from '../lib/supabase';
import { getMergedHiddenStaticStories, fetchSiteDataPublic } from '../lib/github';
import { BookOpen, Box, Briefcase, Building2, Camera, Code, Cpu, Droplet, Feather, Gem, Globe, Home, Languages, Layout, Lightbulb, Monitor, Palette, PenLine, PenTool, Rocket, Search, Video, Wind, Zap, type LucideIcon } from 'lucide-react';
import { slugify } from '../utils/format';

// Helper function to generate deterministic color from name
const getColorFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['3b82f6', '8b5cf6', 'ec4899', 'f97316', '10b981', '06b6d4', 'f59e0b', 'ef4444'];
  return colors[Math.abs(hash) % colors.length];
};

const ICON_MAP: Record<string, LucideIcon> = {
  bookopen: BookOpen,
  box: Box,
  briefcase: Briefcase,
  building2: Building2,
  camera: Camera,
  code: Code,
  cpu: Cpu,
  droplet: Droplet,
  feather: Feather,
  gem: Gem,
  globe: Globe,
  home: Home,
  languages: Languages,
  layout: Layout,
  lightbulb: Lightbulb,
  monitor: Monitor,
  palette: Palette,
  penline: PenLine,
  pentool: PenTool,
  rocket: Rocket,
  search: Search,
  video: Video,
  wind: Wind,
  zap: Zap,
};

interface DataContextType {
  services: Service[];
  projects: Project[];
  team: TeamMember[];
  insights: Post[];
  jobs: Job[];
  partners: Partner[];
  testimonials: Testimonial[];
  isLoading: boolean;
  isUsingSupabase: boolean;
  
  // Actions
  refreshData: () => Promise<void>; // Exposed for AdminDashboard
  
  // Kept for compatibility
  updateService: (id: string, data: Service) => void;
  updateProject: (id: string, data: Project) => void;
  updateTeamMember: (id: string, data: TeamMember) => void;
  updateInsight: (id: string, data: Post) => void;
  addProject: (data: Project) => void;
  addTeamMember: (data: TeamMember) => void;
  addInsight: (data: Post) => void;
  deleteItem: (type: 'service' | 'project' | 'team' | 'insight', id: string) => void;
  updateTeamOrder: (newOrder: TeamMember[]) => Promise<void>;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with Constants (Fallback Data)
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [team, setTeam] = useState<TeamMember[]>(TEAM);
  const [insights, setInsights] = useState<Post[]>(INSIGHTS);
  const [jobs, setJobs] = useState<Job[]>(JOBS);
  const [partners, setPartners] = useState<Partner[]>(PARTNERS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  // Helper to get Lucide Icon from string
  const getIcon = (iconName: string, defaultIcon: React.ReactNode) => {
      if (!iconName) return defaultIcon;
      const IconComponent = ICON_MAP[iconName.toLowerCase()];
      return IconComponent ? <IconComponent size={24} /> : defaultIcon;
  };

  const fetchData = useCallback(async () => {
      const supabase = getSupabaseClient();
      const [hiddenStatic, ghSiteData] = await Promise.all([
          getMergedHiddenStaticStories(),
          fetchSiteDataPublic(),
      ]);

      // Build cover-image lookup maps from site-data.json
      const ghTeamCoverMapById: Record<string, string> = {};
      const ghTeamCoverMapBySlug: Record<string, string> = {};
      const ghTeamCoverMapByName: Record<string, string> = {};
      const normalizeName = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');
      const ghTeamRaw = ghSiteData?.team;
      if (Array.isArray(ghTeamRaw)) {
          for (const m of ghTeamRaw as Array<{ id?: string; slug?: string; name?: string; coverImage?: string }>) {
              if (!m.coverImage) continue;
              if (m.id) ghTeamCoverMapById[m.id] = m.coverImage;
              if (m.slug) ghTeamCoverMapBySlug[m.slug] = m.coverImage;
              if (m.name) ghTeamCoverMapByName[normalizeName(m.name)] = m.coverImage;
          }
      }

      const visibleStaticTestimonials = TESTIMONIALS.filter(t => !hiddenStatic.includes(t.id));
      if (!supabase) {
          // Hydrate static TEAM with cover images from site-data.json (no-op if map is empty)
          setTeam(TEAM.map(m => ({
              ...m,
              coverImage:
                m.coverImage ||
                ghTeamCoverMapById[m.id] ||
                (m.slug ? ghTeamCoverMapBySlug[m.slug] : '') ||
                ghTeamCoverMapByName[normalizeName(m.name)] ||
                '',
          })));
          setTestimonials(visibleStaticTestimonials);
          setIsLoading(false);
          return;
      }

      setIsLoading(true);
      try {
        // Fetch Projects - Now includes description, link, created_by AND gallery
        const { data: dbProjects } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (dbProjects) {
             const formatted = dbProjects.map((p: any) => {
                 // --- FIX FOR GALLERY COUNT ISSUE ---
                 // If database column is 'text', Supabase returns a JSON string.
                 // We must parse it to an Array to get the correct length (count of images),
                 // otherwise .length will count the characters in the string (e.g. 203 chars).
                 let galleryData = p.gallery || [];
                 if (typeof galleryData === 'string') {
                     try {
                         // Parse "['url1', 'url2']" string into actual Array
                         galleryData = JSON.parse(galleryData);
                     } catch (e) {
                         console.warn("Failed to parse gallery JSON", e);
                         galleryData = [];
                     }
                 }

                 return {
                     id: p.id,
                     title: p.title,
                     category: p.category,
                     image: p.image,
                     gallery: Array.isArray(galleryData) ? galleryData : [], // Ensure it is an array
                     client: p.client,
                     slug: p.slug || slugify(p.title),
                     description: p.description, 
                     link: p.link,
                     createdBy: p.created_by,
                     // Map Case Study Fields
                     challenge: p.challenge,
                     challengeKm: p.challenge_km,
                     solution: p.solution,
                     solutionKm: p.solution_km,
                     result: p.result,
                     resultKm: p.result_km
                 };
             });
             // STRICT MODE: Use only DB data
             setProjects(formatted);
        }

        // Fetch Team - CRITICAL: Order by 'order_index' ASC
        const { data: dbTeam } = await supabase.from('team').select('*').order('order_index', { ascending: true });
        if (dbTeam) {
             const formatted = dbTeam.map((t: any) => ({
                 id: t.id,
                 name: t.name,
                 role: t.role,
                 roleKm: t.role_km,
                 image: t.image,
                 bio: t.bio,
                 bioKm: t.bio_km,
                 skills: t.skills || [],
                 experience: t.experience || [],
                 experienceKm: t.experience || [],
 	                 socials: t.socials || {},
 	                 slug: t.slug || slugify(t.name),
 	                 orderIndex: t.order_index, // Ensure this maps correctly
 	                 pinCode: t.pin_code,
	                 coverImage:
                     t.cover_image ||
                     ghTeamCoverMapById[t.id] ||
                     ghTeamCoverMapBySlug[t.slug || slugify(t.name)] ||
                     ghTeamCoverMapByName[normalizeName(t.name)] ||
                     '' // Fallback to GitHub site-data.json
 	             }));
             // STRICT MODE: Use only DB data
             setTeam(formatted);
        }

        // Fetch Insights
        const { data: dbInsights } = await supabase.from('insights').select('*').order('created_at', { ascending: false });
        if (dbInsights) {
             const formatted = dbInsights.map((i: any) => ({
                 id: i.id,
                 title: i.title,
                 titleKm: i.title_km,
                 excerpt: i.excerpt,
                 date: i.date,
                 category: i.category,
                 image: i.image,
                 authorId: i.author_id,
                 link: i.link || '#',
                 content: i.content,
                 comments: [],
                 slug: i.slug || slugify(i.title)
             }));
             // STRICT MODE: Use only DB data
             setInsights(formatted);
        }

        // Fetch Services
        const { data: dbServices } = await supabase.from('services').select('*').order('created_at', { ascending: true });
        if (dbServices) {
            const formatted = dbServices.map((s: any) => ({
                id: s.id,
                title: s.title,
                titleKm: s.title_km,
                subtitle: s.subtitle,
                subtitleKm: s.subtitle_km,
                icon: getIcon(s.icon, <Box size={32} />),
                _iconString: s.icon, 
                color: s.color || 'bg-indigo-500',
                link: s.link || '#',
                description: s.description,
                descriptionKm: s.description_km,
                features: s.features || [],
                featuresKm: s.features_km || [],
                slug: s.slug || slugify(s.title),
                image: s.image, 
            }));
            // STRICT MODE: Use only DB data
            setServices(formatted);
        }

        // Fetch Jobs
        const { data: dbJobs } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
        if (dbJobs) {
            const formatted = dbJobs.map((j: any) => ({
                id: j.id,
                title: j.title,
                type: j.type,
                location: j.location,
                department: j.department,
                description: j.description,
                link: j.link,
                icon: getIcon(j.icon, <Briefcase size={24} />),
                _iconString: j.icon,
                slug: j.slug || slugify(j.title)
            }));
            // STRICT MODE: Use only DB data
            setJobs(formatted);
        }

        // Fetch Partners
        const { data: dbPartners } = await supabase.from('partners').select('*').order('created_at', { ascending: true });
        if (dbPartners && dbPartners.length > 0) {
            const formatted = dbPartners.map((p: any) => ({
                id: p.id,
                name: p.name,
                icon: getIcon(p.icon, <Building2 size={32} />),
                _iconString: p.icon,
                image: p.image
            }));
            setPartners(formatted);
        }

        // Fetch Testimonials (Reviews/Client Stories)
        const { data: dbTestimonials } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        if (dbTestimonials) {
            const formatted = dbTestimonials.map((t: any) => ({
                id: t.id,
                name: t.name,
                role: t.role || 'Client',
                company: t.company || '',
                content: t.content,
                contentKm: t.content_km || t.content,
                avatar: t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=${getColorFromName(t.name)}`
            }));
            setTestimonials([...formatted, ...visibleStaticTestimonials]);
        }

        setIsUsingSupabase(true);
      } catch (error) {
        console.warn("⚠️ Failed to fetch from Supabase.", error);
        setIsUsingSupabase(false);
        setTestimonials(visibleStaticTestimonials);
      } finally {
        setIsLoading(false);
      }
  }, []);

  // Initial Load
  useEffect(() => {
      fetchData();
  }, [fetchData]);


  // --- ROBUST REORDER FUNCTION ---
  const updateTeamOrder = async (newOrder: TeamMember[]) => {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      // 1. Optimistic Update (Immediate Feedback)
      const optimisticOrder = newOrder.map((m, idx) => ({ ...m, orderIndex: idx }));
      setTeam(optimisticOrder);

      try {
          // UUID Regex to check if item exists in DB
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          
          for (let i = 0; i < newOrder.length; i++) {
              const member = newOrder[i];
              const newIndex = i;

              if (uuidRegex.test(member.id)) {
                  // A. EXISTING ITEM: Just update the order_index
                  await supabase.from('team').update({ order_index: newIndex }).eq('id', member.id);
              } else {
                  // B. STATIC ITEM: Must MIGRATE to DB to save position
                  // Note: Since we disabled merging, this branch might not be hit often unless mixed
                  const { error } = await supabase.from('team').insert({
                      name: member.name,
                      role: member.role,
                      role_km: member.roleKm,
                      image: member.image,
                      bio: member.bio,
                      bio_km: member.bioKm,
                      skills: member.skills,
                      experience: member.experience,
                      socials: member.socials,
                      slug: member.slug || slugify(member.name),
                      pin_code: member.pinCode || '1111',
                      order_index: newIndex // SAVE THE EXACT POSITION
                  });

                  if (error) console.error("Error migrating static item:", error);
              }
          }

          // 2. CRITICAL STEP: RELOAD DATA
          await fetchData();

      } catch (err) {
          console.error("Failed to save order:", err);
          alert("Failed to save order. Please check your connection.");
          fetchData(); // Revert on error
      }
  };

  // Placeholders for other actions
  const showAlert = () => alert("Please use the Admin Dashboard.");
  const updateService = () => showAlert();
  const updateProject = () => showAlert();
  const updateTeamMember = () => showAlert();
  const updateInsight = () => showAlert();
  const addProject = () => showAlert();
  const addTeamMember = () => showAlert();
  const addInsight = () => showAlert();
  const deleteItem = () => showAlert();
  
  const resetData = () => {
     if(window.confirm("Reset to default local data?")) {
         setServices(SERVICES); setProjects(PROJECTS); setTeam(TEAM); setInsights(INSIGHTS); setJobs(JOBS); setPartners(PARTNERS); setTestimonials(TESTIMONIALS);
     }
  };

  return (
    <DataContext.Provider value={{
      services, projects, team, insights, jobs, partners, testimonials, isLoading, isUsingSupabase,
      refreshData: fetchData, // Expose fetchData
      updateService, updateProject, updateTeamMember, updateInsight,
      addProject, addTeamMember, addInsight, deleteItem,
      updateTeamOrder,
      resetData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
