import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  CalendarDays, 
  MapPin, 
  Sprout, 
  ShieldCheck, 
  ClipboardList, 
  AlertTriangle, 
  Calculator, 
  Briefcase,
  Compass,
  Phone,
  Building,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useProjects, NavigationTab } from '../../context/ProjectContext';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    projects, 
    tasks, 
    nurseryItems, 
    permits, 
    snags, 
    siteLogs,
    selectedProjectId,
    setSelectedProjectId
  } = useProjects();

  const openTasksCount = tasks.filter(t => t.status !== 'done').length;
  const pendingPermitsCount = permits.filter(p => p.status !== 'Approved & Stamped').length;
  const openSnagsCount = snags.filter(s => s.status !== 'Resolved & Approved').length;

  const navItems: { id: NavigationTab; label: string; icon: any; count?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects Directory', icon: FolderKanban, count: projects.length },
    { id: 'kanban', label: 'Kanban Workflow', icon: CheckSquare, count: openTasksCount, badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    { id: 'timeline', label: 'Gantt & Seasonality', icon: CalendarDays },
    { id: 'map', label: 'Nigeria Sites Map', icon: MapPin },
    { id: 'nursery', label: 'Plant Nursery & Bio-Wall', icon: Sprout, count: nurseryItems.length },
    { id: 'permits', label: 'Statutory Permits', icon: ShieldCheck, count: pendingPermitsCount, badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
    { id: 'sitelogs', label: 'Daily Field Reports', icon: ClipboardList, count: siteLogs.length },
    { id: 'snagging', label: 'Snagging & Punch Lists', icon: AlertTriangle, count: openSnagsCount, badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' },
    { id: 'boq', label: 'BOQ & Valuations', icon: Calculator },
    { id: 'client-portal', label: 'Client VIP Portal', icon: Briefcase },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-stone-50/90 dark:bg-[#0A0D0B] border-r border-stone-200 dark:border-stone-800 flex flex-col justify-between h-[calc(100vh-53px)] sticky top-[53px] overflow-y-auto custom-scrollbar select-none transition-colors">
      <div className="p-3 space-y-4">
        {/* Active Project Switcher */}
        <div className="bg-white dark:bg-stone-900/90 rounded-xl p-2.5 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Active Focus Project
            </span>
            <Compass className="w-3.5 h-3.5 text-arabella-600 dark:text-arabella-400 animate-spin-slow" />
          </div>
          <select
            value={selectedProjectId || ''}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="w-full text-xs font-medium bg-stone-100 dark:bg-stone-800 border-none rounded-lg p-2 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-arabella-600 cursor-pointer truncate"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.code} &bull; {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-arabella-900 text-gold-300 dark:bg-arabella-950 dark:text-gold-400 shadow-xs font-semibold'
                    : 'text-stone-700 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-gold-400' : 'text-stone-500 dark:text-stone-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeColor || (isActive ? 'bg-gold-500/20 text-gold-300' : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300')
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Studio Location & Footer Info */}
      <div className="p-3 border-t border-stone-200 dark:border-stone-800">
        <div className="bg-gradient-to-br from-arabella-950 to-arabella-900 text-stone-100 rounded-xl p-3 border border-gold-500/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-serif uppercase tracking-widest text-gold-400 font-semibold">
              Arabella Atelier
            </span>
            <span className="text-[9px] bg-arabella-800 text-arabella-200 px-1.5 py-0.2 rounded border border-arabella-700">
              Est. 1990
            </span>
          </div>
          <p className="text-[11px] text-stone-300 leading-tight">
            55, Moleye St, Off Herbert Macaulay, Yaba, Lagos
          </p>
          <div className="pt-1 border-t border-arabella-800/80 flex items-center justify-between text-[10px] text-stone-400">
            <span>Abuja &bull; Lagos &bull; PH</span>
            <span className="text-gold-400/90 font-mono">BDW Studio</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
