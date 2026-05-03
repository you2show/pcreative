import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SERVICES, PROJECTS, TEAM, INSIGHTS, JOBS, PARTNERS } from '../constants';
import { Service, Project, TeamMember, Post, Job, Partner } from '../types';
import { fetchSiteData, saveSiteData, getGitHubConfig, SiteData } from '../lib/github';
import * as LucideIcons from 'lucide-react';
import { slugify } from '../utils/format';

interface DataContextType {
  services: Service[];
  projects: Project[];
  team: TeamMember[];
  insights: Post[];
  jobs: Job[];
  partners: Partner[];
  isLoading: boolean;
  isUsingSupabase: boolean; // kept for compatibility; true when GitHub data loaded

  // Actions
  refreshData: () => Promise<void>;

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

// Helper to get Lucide Icon from string
const getIcon = (iconName: string, defaultIcon: React.ReactNode): React.ReactNode => {
    if (!iconName) return defaultIcon;
    const formattedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    const IconComponent = (LucideIcons as any)[formattedName];
    return IconComponent ? <IconComponent size={24} /> : defaultIcon;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [team, setTeam] = useState<TeamMember[]>(TEAM);
  const [insights, setInsights] = useState<Post[]>(INSIGHTS);
  const [jobs, setJobs] = useState<Job[]>(JOBS);
  const [partners, setPartners] = useState<Partner[]>(PARTNERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  const applyData = (data: SiteData) => {
      if (data.services && data.services.length > 0) {
          setServices(data.services.map((s: any) => ({
              ...s,
              icon: getIcon(s._iconString || s.icon, <LucideIcons.Box size={32} />),
              _iconString: s._iconString || (typeof s.icon === 'string' ? s.icon : 'Box'),
          })));
      }
      if (data.projects && data.projects.length > 0) {
          setProjects(data.projects.map((p: any) => ({
              ...p,
              gallery: Array.isArray(p.gallery) ? p.gallery : [],
              slug: p.slug || slugify(p.title || ''),
          })));
      }
      if (data.team && data.team.length > 0) {
          const sorted = [...data.team].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
          setTeam(sorted.map((t: any) => ({
              ...t,
              skills: t.skills || [],
              experience: t.experience || [],
              socials: t.socials || {},
              slug: t.slug || slugify(t.name || ''),
          })));
      }
      if (data.insights && data.insights.length > 0) {
          setInsights(data.insights.map((i: any) => ({
              ...i,
              link: i.link || '#',
              comments: [],
              slug: i.slug || slugify(i.title || ''),
          })));
      }
      if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs.map((j: any) => ({
              ...j,
              icon: getIcon(j._iconString || j.icon, <LucideIcons.Briefcase size={24} />),
              _iconString: j._iconString || (typeof j.icon === 'string' ? j.icon : 'Code'),
          })));
      }
      if (data.partners && data.partners.length > 0) {
          setPartners(data.partners.map((p: any) => ({
              ...p,
              icon: getIcon(p._iconString || p.icon, <LucideIcons.Building2 size={32} />),
              _iconString: p._iconString || (typeof p.icon === 'string' ? p.icon : 'Building2'),
          })));
      }
      setIsUsingSupabase(true);
  };

  const fetchData = useCallback(async () => {
      const config = getGitHubConfig();
      if (!config) {
          setIsLoading(false);
          return;
      }
      setIsLoading(true);
      try {
          const data = await fetchSiteData(config);
          if (data) {
              applyData(data);
          }
      } catch (error) {
          console.warn('⚠️ Failed to fetch from GitHub.', error);
          setIsUsingSupabase(false);
      } finally {
          setIsLoading(false);
      }
  }, []);

  useEffect(() => {
      fetchData();
  }, [fetchData]);

  const updateTeamOrder = async (newOrder: TeamMember[]) => {
      const config = getGitHubConfig();
      if (!config) return;

      const optimistic = newOrder.map((m, idx) => ({ ...m, orderIndex: idx }));
      setTeam(optimistic);

      try {
          const data = await fetchSiteData(config);
          if (!data) throw new Error('Could not load current data');

          const serialized = optimistic.map((m) => serializeTeamMember(m));
          data.team = serialized;
          await saveSiteData(config, data);
          await fetchData();
      } catch (err) {
          console.error('Failed to save order:', err);
          alert('Failed to save order. Please check your connection.');
          fetchData();
      }
  };

  const showAlert = () => alert('Please use the Admin Dashboard.');
  const updateService = () => showAlert();
  const updateProject = () => showAlert();
  const updateTeamMember = () => showAlert();
  const updateInsight = () => showAlert();
  const addProject = () => showAlert();
  const addTeamMember = () => showAlert();
  const addInsight = () => showAlert();
  const deleteItem = () => showAlert();

  const resetData = () => {
      if (window.confirm('Reset to default local data?')) {
          setServices(SERVICES);
          setProjects(PROJECTS);
          setTeam(TEAM);
          setInsights(INSIGHTS);
          setJobs(JOBS);
          setPartners(PARTNERS);
      }
  };

  return (
      <DataContext.Provider value={{
          services, projects, team, insights, jobs, partners,
          isLoading, isUsingSupabase,
          refreshData: fetchData,
          updateService, updateProject, updateTeamMember, updateInsight,
          addProject, addTeamMember, addInsight, deleteItem,
          updateTeamOrder,
          resetData,
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

// Helpers for serializing typed objects to plain JSON (strip React nodes, keep strings)
export function serializeTeamMember(m: TeamMember): any {
    return {
        id: m.id, name: m.name, role: m.role, roleKm: m.roleKm,
        image: m.image, coverImage: m.coverImage,
        bio: m.bio, bioKm: m.bioKm,
        skills: m.skills || [], experience: m.experience || [],
        socials: m.socials || {},
        slug: m.slug || slugify(m.name || ''),
        orderIndex: m.orderIndex ?? 0,
        pinCode: m.pinCode,
    };
}

export function serializeProject(p: Project): any {
    return {
        id: p.id, title: p.title, category: p.category,
        image: p.image, gallery: p.gallery || [],
        client: p.client, slug: p.slug || slugify(p.title || ''),
        description: p.description, link: p.link, liveUrl: p.liveUrl,
        features: p.features || [], createdBy: p.createdBy,
        challenge: p.challenge, challengeKm: p.challengeKm,
        solution: p.solution, solutionKm: p.solutionKm,
        result: p.result, resultKm: p.resultKm,
    };
}

export function serializeService(s: Service): any {
    return {
        id: s.id, title: s.title, titleKm: s.titleKm,
        subtitle: s.subtitle, subtitleKm: s.subtitleKm,
        _iconString: s._iconString || 'Box',
        icon: s._iconString || 'Box',
        color: s.color, link: s.link,
        description: s.description, descriptionKm: s.descriptionKm,
        features: s.features || [], featuresKm: s.featuresKm || [],
        slug: s.slug || slugify(s.title || ''),
        image: s.image,
    };
}

export function serializeInsight(i: Post): any {
    return {
        id: i.id, title: i.title, titleKm: i.titleKm,
        excerpt: i.excerpt, date: i.date, category: i.category,
        image: i.image, link: i.link || '#',
        authorId: i.authorId, content: i.content, contentKm: i.contentKm,
        slug: i.slug || slugify(i.title || ''),
    };
}

export function serializeJob(j: Job): any {
    return {
        id: j.id, title: j.title, type: j.type,
        location: j.location, department: j.department,
        _iconString: j._iconString || 'Code',
        icon: j._iconString || 'Code',
        link: j.link, description: j.description,
        slug: j.slug || slugify(j.title || ''),
    };
}

export function serializePartner(p: Partner): any {
    return {
        id: p.id, name: p.name,
        _iconString: p._iconString || 'Building2',
        icon: p._iconString || 'Building2',
        image: p.image,
    };
}
