import React, { useState } from 'react';
import { 
  MapPin, 
  Building2, 
  Compass, 
  ExternalLink, 
  Navigation, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { formatCurrency, getDisciplineBadgeClass, getHealthBadgeClass } from '../../utils/formatters';

export const NigeriaProjectMapView: React.FC = () => {
  const { projects, setSelectedProjectId, setActiveTab, disciplineFilter } = useProjects();
  const [activePinId, setActivePinId] = useState<string>(projects[0]?.id || '');

  const filtered = projects.filter(p => {
    if (disciplineFilter !== 'All' && p.discipline !== disciplineFilter) return false;
    return true;
  });

  const activeProject = projects.find(p => p.id === activePinId) || projects[0];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-arabella-100 text-arabella-900 dark:bg-arabella-950 dark:text-arabella-300 text-[11px] font-bold mb-1">
          <Navigation className="w-3.5 h-3.5" />
          <span>Geospatial Project Intelligence &amp; Site Distribution</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
          Nigeria Commissions &amp; Holding Yards Map
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Geographic monitoring of active landscape sites, BDW residences, and nursery propagation facilities across Lagos and Abuja.
        </p>
      </div>

      {/* Main Grid: Interactive Map Visual on Left + Project Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visual (2 cols) */}
        <div className="lg:col-span-2 bg-gradient-to-b from-[#0A1710] to-[#040C07] rounded-2xl border border-stone-800 p-6 relative overflow-hidden shadow-xl min-h-[500px] flex flex-col justify-between">
          {/* Subtle Nigeria / West Africa topographic grid overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00722C_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Map Top Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-gold-400 animate-spin-slow" />
              <span className="font-mono uppercase font-bold text-gold-400">Federal Republic of Nigeria</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{filtered.length} Sites Synchronized</span>
            </div>
          </div>

          {/* Simulated Geographical Interactive Nodes for Lagos and Abuja */}
          <div className="relative z-10 my-8 py-10 flex flex-col sm:flex-row items-center justify-around gap-8">
            
            {/* Lagos Cluster Area */}
            <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 w-full sm:w-72 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-white text-base">Lagos Coastal Hub</h4>
                  <span className="text-[10px] text-stone-400 font-mono">6.45° N, 3.42° E</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-arabella-700/80 text-gold-300">
                  Atlantic Coast
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Ikoyi, Victoria Island, Lekki Phase 1, and Epe Glasshouse Nursery.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-white/10">
                {projects.filter(p => p.location.city === 'Lagos').map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActivePinId(p.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                      activePinId === p.id
                        ? 'bg-arabella-800 text-gold-300 font-bold border border-gold-400/30 shadow-xs'
                        : 'text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-[10px] font-mono text-stone-400">{p.location.neighborhood}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Abuja Cluster Area */}
            <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 w-full sm:w-72 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-white text-base">Abuja Savanna Hub</h4>
                  <span className="text-[10px] text-stone-400 font-mono">9.05° N, 7.49° E</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-bdw-700/80 text-gold-300">
                  Federal Capital
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Guzape Diplomatic Ridge, Maitama, and Abuja Holding Depot.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-white/10">
                {projects.filter(p => p.location.city === 'Abuja').map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActivePinId(p.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                      activePinId === p.id
                        ? 'bg-bdw-800 text-gold-300 font-bold border border-gold-400/30 shadow-xs'
                        : 'text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-[10px] font-mono text-stone-400">{p.location.neighborhood}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Map Footer status */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-stone-400 border-t border-white/10 pt-3">
            <span>Arabella Logistics Network: Lekki &bull; Epe &bull; Abuja</span>
            <span>WGS84 Coordinates System</span>
          </div>
        </div>

        {/* Selected Project Card Preview (1 col) */}
        {activeProject && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              {/* Image */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-stone-900 mb-4">
                <img
                  src={activeProject.coverImage}
                  alt={activeProject.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getDisciplineBadgeClass(activeProject.discipline)}`}>
                    {activeProject.discipline}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <div className="text-[10px] font-mono text-gold-300">{activeProject.code}</div>
                  <h3 className="font-serif text-lg font-bold text-white leading-tight">
                    {activeProject.name}
                  </h3>
                </div>
              </div>

              {/* Specs */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Site Coordinates:</span>
                  <span className="font-mono text-stone-700 dark:text-stone-300 font-bold">
                    {activeProject.location.coordinates[0].toFixed(4)}°N, {activeProject.location.coordinates[1].toFixed(4)}°E
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Street Address:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200 truncate max-w-[190px]">
                    {activeProject.location.address}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Current Phase:</span>
                  <span className="font-bold text-arabella-900 dark:text-arabella-300">
                    {activeProject.currentStage}
                  </span>
                </div>

                {/* Highlights */}
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Scope Highlights:</span>
                  <ul className="text-[11px] text-stone-600 dark:text-stone-300 space-y-0.5">
                    {activeProject.highlights.slice(0, 2).map((h, i) => (
                      <li key={i}>&bull; {h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action to open full details */}
            <button
              onClick={() => {
                setSelectedProjectId(activeProject.id);
                setActiveTab('projects');
              }}
              className="w-full py-2.5 rounded-xl bg-arabella-900 hover:bg-arabella-800 text-gold-300 font-bold text-xs border border-gold-500/30 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Inspect Project File</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
