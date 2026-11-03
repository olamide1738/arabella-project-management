import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Moon, 
  Sun, 
  Download, 
  RotateCcw, 
  MapPin, 
  Clock, 
  Plus, 
  SlidersHorizontal,
  Leaf
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { Discipline } from '../../types';

interface NavbarProps {
  onOpenNewProject: () => void;
  onOpenNewTask: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewProject, onOpenNewTask }) => {
  const {
    disciplineFilter,
    setDisciplineFilter,
    cityFilter,
    setCityFilter,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    resetToSampleData,
    exportBackup,
    projects,
  } = useProjects();

  const [watTime, setWatTime] = useState('');

  // Update Nigerian Local Time (West Africa Time - UTC+1)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      setWatTime(`${timeStr} WAT (Lagos)`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0E1310]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3 min-w-max">
          <div className="w-10 h-10 rounded-xl bg-arabella-900 border border-gold-500/30 flex items-center justify-center shadow-sm">
            <span className="font-serif text-2xl font-bold text-gold-400">A</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-arabella-950 dark:text-stone-100">
                ARABELLA
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-arabella-100 text-arabella-800 dark:bg-arabella-950 dark:text-arabella-300 border border-arabella-300 dark:border-arabella-700">
                Atelier PM
              </span>
              <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-bdw-100 text-bdw-700 dark:bg-bdw-950 dark:text-bdw-300 border border-bdw-300 dark:border-bdw-700">
                BDW Studio
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-none">
              Landscape Architecture &bull; Site Development &bull; Building Design
            </p>
          </div>
        </div>

        {/* Global Search & Filters */}
        <div className="flex-1 max-w-xl mx-2 hidden md:flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects, client, species, permits, site logs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-arabella-600 dark:focus:ring-arabella-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                &times;
              </button>
            )}
          </div>

          {/* Discipline Filter */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900/80 p-0.5 rounded-lg border border-stone-200 dark:border-stone-800 text-[11px]">
            {(['All', 'Landscape', 'Architecture', 'Integrated Design-Build'] as ('All' | Discipline)[]).map(d => (
              <button
                key={d}
                onClick={() => setDisciplineFilter(d)}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  disciplineFilter === d
                    ? 'bg-white dark:bg-stone-800 text-arabella-900 dark:text-arabella-300 shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {d === 'Integrated Design-Build' ? 'Integrated' : d}
              </button>
            ))}
          </div>

          {/* City Filter */}
          <div className="relative">
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value as any)}
              className="text-[11px] bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-lg px-2.5 py-1 text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-arabella-600 cursor-pointer"
            >
              <option value="All">All Cities (Nigeria)</option>
              <option value="Lagos">Lagos (Ikoyi, VI, Lekki)</option>
              <option value="Abuja">Abuja (Guzape, Maitama)</option>
              <option value="Port Harcourt">Port Harcourt</option>
              <option value="Ibadan">Ibadan</option>
            </select>
          </div>
        </div>

        {/* Action Buttons & Utilities */}
        <div className="flex items-center gap-2">
          {/* Studio clock */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-900 px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-800">
            <Clock className="w-3.5 h-3.5 text-arabella-600 dark:text-arabella-400" />
            <span className="font-mono">{watTime}</span>
          </div>

          {/* New Project Button */}
          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-arabella-900 hover:bg-arabella-800 text-gold-300 text-xs font-medium border border-gold-500/30 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Project</span>
          </button>

          {/* Quick Task Button */}
          <button
            onClick={onOpenNewTask}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium border border-stone-200 dark:border-stone-700 shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-arabella-600" />
            <span>Task</span>
          </button>

          {/* Export Backup */}
          <button
            onClick={exportBackup}
            title="Export JSON System Backup"
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Reset sample data */}
          <button
            onClick={resetToSampleData}
            title="Reset to Arabella Portfolio Sample Data"
            className="p-1.5 rounded-lg text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
