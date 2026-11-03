import React, { useState } from 'react';
import { 
  Calendar, 
  CloudRain, 
  Sun, 
  Clock, 
  Info, 
  ChevronRight, 
  Compass, 
  Layers,
  MapPin
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { formatDate, getDisciplineBadgeClass, getHealthBadgeClass } from '../../utils/formatters';

export const GanttTimelineView: React.FC = () => {
  const { projects, disciplineFilter, cityFilter, setSelectedProjectId, setActiveTab } = useProjects();

  const filtered = projects.filter(p => {
    if (disciplineFilter !== 'All' && p.discipline !== disciplineFilter) return false;
    if (cityFilter !== 'All' && p.location.city !== cityFilter) return false;
    return true;
  });

  const MONTHS = [
    { name: 'Jan', season: 'Dry / Harmattan', color: 'bg-amber-100/40 text-amber-900 dark:bg-amber-950/20 dark:text-amber-300' },
    { name: 'Feb', season: 'Dry / Harmattan', color: 'bg-amber-100/40 text-amber-900 dark:bg-amber-950/20 dark:text-amber-300' },
    { name: 'Mar', season: 'Late Dry / Prep', color: 'bg-amber-100/40 text-amber-900 dark:bg-amber-950/20 dark:text-amber-300' },
    { name: 'Apr', season: 'Wet Season Begins', color: 'bg-sky-100/40 text-sky-900 dark:bg-sky-950/30 dark:text-sky-300' },
    { name: 'May', season: 'Heavy Rains', color: 'bg-sky-200/50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-300' },
    { name: 'Jun', season: 'Peak Lagos Rains', color: 'bg-sky-200/60 text-sky-950 dark:bg-sky-900/50 dark:text-sky-200' },
    { name: 'Jul', season: 'Peak Coastal Storms', color: 'bg-sky-200/60 text-sky-950 dark:bg-sky-900/50 dark:text-sky-200' },
    { name: 'Aug', season: 'August Break (Short Dry)', color: 'bg-emerald-100/40 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300' },
    { name: 'Sep', season: 'Late Wet Season', color: 'bg-sky-200/50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-300' },
    { name: 'Oct', season: 'Rains Taper Off', color: 'bg-sky-100/40 text-sky-900 dark:bg-sky-950/30 dark:text-sky-300' },
    { name: 'Nov', season: 'Dry Season Prime', color: 'bg-amber-100/40 text-amber-900 dark:bg-amber-950/20 dark:text-amber-300' },
    { name: 'Dec', season: 'Harmattan Haze', color: 'bg-amber-100/40 text-amber-900 dark:bg-amber-950/20 dark:text-amber-300' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
          Master Programme & Nigerian Climate Seasonality
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Schedule civil earthworks, granite paving, and delicate softscape planting around the Nigerian wet and dry seasons.
        </p>
      </div>

      {/* Seasonality Advisory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
            <Sun className="w-4 h-4 text-amber-600" />
            <span>Dry Season (Nov &ndash; Mar): Civil Groundworks & Hardscape Peak</span>
          </div>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-[11px]">
            Zero risk of trench washout or groundwater inundation. Ideal window for deep borehole piling (Lekki), SuDS retaining walls, granite paving, and structural steel trellis installation. Ensure automated drip irrigation is commissioned immediately upon soft planting.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-sky-900 dark:text-sky-200 font-bold">
            <CloudRain className="w-4 h-4 text-sky-600" />
            <span>Wet Season (Apr &ndash; Oct): Horticultural Growth & Bio-Wall Season</span>
          </div>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-[11px]">
            Peak growth acceleration for Arabella nursery specimens, mature royal palms, Bermuda lawn sod, and vertical bio-facade matrices. Schedule all bulk earthworks before May to avoid mud bottlenecks on site.
          </p>
        </div>
      </div>

      {/* Interactive Gantt Chart */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-arabella-600" />
            <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
              Annual 12-Month Project Timeline
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-mono">Cycle 2024 &ndash; 2025</span>
        </div>

        {/* Season Headers */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Months Header */}
            <div className="grid grid-cols-12 border-b border-stone-200 dark:border-stone-800 text-center text-xs">
              {MONTHS.map((m, idx) => (
                <div key={idx} className={`p-2 border-r border-stone-200 dark:border-stone-800 last:border-r-0 ${m.color}`}>
                  <div className="font-bold">{m.name}</div>
                  <div className="text-[9px] truncate">{m.season}</div>
                </div>
              ))}
            </div>

            {/* Project Bars */}
            <div className="divide-y divide-stone-100 dark:divide-stone-800/80 p-2">
              {filtered.map((proj, pIdx) => {
                // Calculate simulated start & span percentage across the 12-month calendar
                const startMonth = Math.max(0, new Date(proj.timeline.startDate).getMonth());
                const endMonth = Math.min(11, new Date(proj.timeline.targetCompletion).getMonth());
                const spanMonths = Math.max(1, endMonth - startMonth + 1);
                const leftPercent = (startMonth / 12) * 100;
                const widthPercent = Math.min(100 - leftPercent, (spanMonths / 12) * 100);

                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setActiveTab('projects');
                    }}
                    className="py-3 px-2 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl transition-colors cursor-pointer group"
                  >
                    {/* Project summary line */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[10px] font-bold text-stone-400">
                          {proj.code}
                        </span>
                        <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-arabella-600 dark:group-hover:text-arabella-400 transition-colors truncate">
                          {proj.name}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded border ${getDisciplineBadgeClass(proj.discipline)}`}>
                          {proj.discipline}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-stone-500 text-[11px] flex-shrink-0">
                        <span>{proj.location.city}</span>
                        <span>&bull;</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {proj.timeline.progressPercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Timeline bar row */}
                    <div className="relative h-7 bg-stone-100 dark:bg-stone-800/70 rounded-lg overflow-hidden flex items-center p-0.5">
                      {/* Grid background markers */}
                      <div className="absolute inset-0 grid grid-cols-12 pointer-events-none divide-x divide-stone-200/40 dark:divide-stone-700/30" />

                      {/* Active project bar */}
                      <div
                        className={`relative h-6 rounded-md shadow-xs transition-all flex items-center justify-between px-2 text-[10px] text-white font-medium ${
                          proj.discipline === 'Architecture'
                            ? 'bg-gradient-to-r from-bdw-700 to-bdw-500'
                            : 'bg-gradient-to-r from-arabella-800 to-arabella-600'
                        }`}
                        style={{
                          left: `${leftPercent}%`,
                          width: `${Math.max(12, widthPercent)}%`,
                        }}
                      >
                        <span className="truncate">{proj.currentStage}</span>
                        <span className="font-mono font-bold">{proj.timeline.progressPercentage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
