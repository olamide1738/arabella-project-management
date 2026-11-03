import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Project, 
  Task, 
  NurseryItem, 
  StatutoryPermit, 
  SiteLog, 
  SnagItem, 
  BOQItem, 
  TeamMember,
  Discipline
} from '../types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_TASKS, 
  INITIAL_NURSERY_ITEMS, 
  INITIAL_PERMITS, 
  INITIAL_SITE_LOGS, 
  INITIAL_SNAGS, 
  INITIAL_BOQ, 
  TEAM_MEMBERS 
} from '../data/mockData';

export type NavigationTab = 
  | 'dashboard' 
  | 'projects' 
  | 'kanban' 
  | 'timeline' 
  | 'map' 
  | 'nursery' 
  | 'permits' 
  | 'sitelogs' 
  | 'snagging' 
  | 'boq' 
  | 'client-portal';

interface ProjectContextType {
  projects: Project[];
  tasks: Task[];
  nurseryItems: NurseryItem[];
  permits: StatutoryPermit[];
  siteLogs: SiteLog[];
  snags: SnagItem[];
  boqItems: BOQItem[];
  teamMembers: TeamMember[];
  
  // Navigation & Selection
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedProject: Project | null;
  
  // Filtering & Search
  disciplineFilter: 'All' | Discipline;
  setDisciplineFilter: (d: 'All' | Discipline) => void;
  cityFilter: 'All' | 'Lagos' | 'Abuja' | 'Port Harcourt' | 'Ibadan';
  setCityFilter: (c: 'All' | 'Lagos' | 'Abuja' | 'Port Harcourt' | 'Ibadan') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Dark mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Project CRUD
  addProject: (p: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleStageGate: (projectId: string, gateId: string) => void;
  
  // Task CRUD
  addTask: (t: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  
  // Nursery Actions
  addNurseryItem: (item: Omit<NurseryItem, 'id'>) => void;
  updateNurseryStock: (id: string, deltaStock: number) => void;
  
  // Permits Actions
  addPermit: (p: Omit<StatutoryPermit, 'id'>) => void;
  updatePermitStatus: (id: string, status: StatutoryPermit['status'], notes?: string) => void;
  
  // Site Log Actions
  addSiteLog: (log: Omit<SiteLog, 'id'>) => void;
  
  // Snagging Actions
  addSnag: (snag: Omit<SnagItem, 'id' | 'reportedDate'>) => void;
  resolveSnag: (id: string) => void;
  
  // BOQ Actions
  addBOQItem: (item: Omit<BOQItem, 'id'>) => void;
  updateBOQClaim: (id: string, percentage: number) => void;
  
  // Data reset & export
  resetToSampleData: () => void;
  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROJECTS: 'arabella_pm_projects_v1',
  TASKS: 'arabella_pm_tasks_v1',
  NURSERY: 'arabella_pm_nursery_v1',
  PERMITS: 'arabella_pm_permits_v1',
  SITE_LOGS: 'arabella_pm_site_logs_v1',
  SNAGS: 'arabella_pm_snags_v1',
  BOQ: 'arabella_pm_boq_v1',
  DARK_MODE: 'arabella_pm_darkmode_v1',
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Projects
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Nursery Items
  const [nurseryItems, setNurseryItems] = useState<NurseryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NURSERY);
      return saved ? JSON.parse(saved) : INITIAL_NURSERY_ITEMS;
    } catch {
      return INITIAL_NURSERY_ITEMS;
    }
  });

  // Permits
  const [permits, setPermits] = useState<StatutoryPermit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PERMITS);
      return saved ? JSON.parse(saved) : INITIAL_PERMITS;
    } catch {
      return INITIAL_PERMITS;
    }
  });

  // Site Logs
  const [siteLogs, setSiteLogs] = useState<SiteLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SITE_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_SITE_LOGS;
    } catch {
      return INITIAL_SITE_LOGS;
    }
  });

  // Snags
  const [snags, setSnags] = useState<SnagItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SNAGS);
      return saved ? JSON.parse(saved) : INITIAL_SNAGS;
    } catch {
      return INITIAL_SNAGS;
    }
  });

  // BOQ
  const [boqItems, setBoqItems] = useState<BOQItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOQ);
      return saved ? JSON.parse(saved) : INITIAL_BOQ;
    } catch {
      return INITIAL_BOQ;
    }
  });

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Navigation & selection
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('proj-001');

  // Filters
  const [disciplineFilter, setDisciplineFilter] = useState<'All' | Discipline>('All');
  const [cityFilter, setCityFilter] = useState<'All' | 'Lagos' | 'Abuja' | 'Port Harcourt' | 'Ibadan'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NURSERY, JSON.stringify(nurseryItems));
  }, [nurseryItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERMITS, JSON.stringify(permits));
  }, [permits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SITE_LOGS, JSON.stringify(siteLogs));
  }, [siteLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SNAGS, JSON.stringify(snags));
  }, [snags]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOQ, JSON.stringify(boqItems));
  }, [boqItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Selected project object
  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  // Project CRUD
  const addProject = (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProj: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setProjects(prev => [newProj, ...prev]);
    setSelectedProjectId(newProj.id);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId(projects.length > 1 ? projects[0].id : null);
    }
  };

  const toggleStageGate = (projectId: string, gateId: string) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        const updatedGates = p.stageGates.map(g =>
          g.id === gateId
            ? {
                ...g,
                completed: !g.completed,
                signedOffAt: !g.completed ? new Date().toISOString().split('T')[0] : undefined,
                signedOffBy: !g.completed ? 'Principal Lead' : undefined,
              }
            : g
        );
        const completedCount = updatedGates.filter(g => g.completed).length;
        const totalCount = updatedGates.length;
        const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : p.timeline.progressPercentage;

        return {
          ...p,
          stageGates: updatedGates,
          timeline: {
            ...p.timeline,
            progressPercentage,
          },
          updatedAt: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  // Task Actions
  const addTask = (data: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...data,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // Nursery Actions
  const addNurseryItem = (data: Omit<NurseryItem, 'id'>) => {
    const newItem: NurseryItem = {
      ...data,
      id: `nur-${Date.now()}`,
    };
    setNurseryItems(prev => [newItem, ...prev]);
  };

  const updateNurseryStock = (id: string, deltaStock: number) => {
    setNurseryItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const newStock = Math.max(0, item.currentStock + deltaStock);
        const newAvailable = Math.max(0, newStock - item.reservedStock);
        return {
          ...item,
          currentStock: newStock,
          availableStock: newAvailable,
        };
      })
    );
  };

  // Permits Actions
  const addPermit = (data: Omit<StatutoryPermit, 'id'>) => {
    const newPermit: StatutoryPermit = {
      ...data,
      id: `per-${Date.now()}`,
    };
    setPermits(prev => [newPermit, ...prev]);
  };

  const updatePermitStatus = (id: string, status: StatutoryPermit['status'], notes?: string) => {
    setPermits(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        return {
          ...p,
          status,
          actualApprovalDate: status === 'Approved & Stamped' ? new Date().toISOString().split('T')[0] : p.actualApprovalDate,
          notes: notes ? `${p.notes ? p.notes + ' | ' : ''}${notes}` : p.notes,
        };
      })
    );
  };

  // Site Logs
  const addSiteLog = (data: Omit<SiteLog, 'id'>) => {
    const newLog: SiteLog = {
      ...data,
      id: `log-${Date.now()}`,
    };
    setSiteLogs(prev => [newLog, ...prev]);
  };

  // Snags
  const addSnag = (data: Omit<SnagItem, 'id' | 'reportedDate'>) => {
    const newSnag: SnagItem = {
      ...data,
      id: `sng-${Date.now()}`,
      reportedDate: new Date().toISOString().split('T')[0],
    };
    setSnags(prev => [newSnag, ...prev]);
  };

  const resolveSnag = (id: string) => {
    setSnags(prev =>
      prev.map(s =>
        s.id === id
          ? {
              ...s,
              status: 'Resolved & Approved',
              resolvedDate: new Date().toISOString().split('T')[0],
            }
          : s
      )
    );
  };

  // BOQ
  const addBOQItem = (data: Omit<BOQItem, 'id'>) => {
    const newBoq: BOQItem = {
      ...data,
      id: `boq-${Date.now()}`,
    };
    setBoqItems(prev => [newBoq, ...prev]);
  };

  const updateBOQClaim = (id: string, percentage: number) => {
    setBoqItems(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        const certified = Math.round(b.totalNGN * (percentage / 100));
        return {
          ...b,
          claimedPercentage: percentage,
          certifiedAmountNGN: certified,
          status: percentage >= 100 ? 'Certified & Paid' : 'In Budget',
        };
      })
    );
  };

  // Reset to initial
  const resetToSampleData = () => {
    if (window.confirm('Reset all Arabella project management data to original company showcase data?')) {
      localStorage.clear();
      setProjects(INITIAL_PROJECTS);
      setTasks(INITIAL_TASKS);
      setNurseryItems(INITIAL_NURSERY_ITEMS);
      setPermits(INITIAL_PERMITS);
      setSiteLogs(INITIAL_SITE_LOGS);
      setSnags(INITIAL_SNAGS);
      setBoqItems(INITIAL_BOQ);
      setSelectedProjectId('proj-001');
    }
  };

  // Export JSON backup
  const exportBackup = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projects,
      tasks,
      nurseryItems,
      permits,
      siteLogs,
      snags,
      boqItems,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Arabella-ProjectEngine-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const importBackup = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.projects) setProjects(data.projects);
      if (data.tasks) setTasks(data.tasks);
      if (data.nurseryItems) setNurseryItems(data.nurseryItems);
      if (data.permits) setPermits(data.permits);
      if (data.siteLogs) setSiteLogs(data.siteLogs);
      if (data.snags) setSnags(data.snags);
      if (data.boqItems) setBoqItems(data.boqItems);
      return true;
    } catch (err) {
      console.error('Import error:', err);
      return false;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        tasks,
        nurseryItems,
        permits,
        siteLogs,
        snags,
        boqItems,
        teamMembers: TEAM_MEMBERS,

        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        selectedProject,

        disciplineFilter,
        setDisciplineFilter,
        cityFilter,
        setCityFilter,
        searchQuery,
        setSearchQuery,

        isDarkMode,
        toggleDarkMode,

        addProject,
        updateProject,
        deleteProject,
        toggleStageGate,

        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,

        addNurseryItem,
        updateNurseryStock,

        addPermit,
        updatePermitStatus,

        addSiteLog,

        addSnag,
        resolveSnag,

        addBOQItem,
        updateBOQClaim,

        resetToSampleData,
        exportBackup,
        importBackup,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
