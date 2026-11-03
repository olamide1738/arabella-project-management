import React from 'react';
import { 
  Building2, 
  TrendingUp, 
  Sprout, 
  ShieldCheck, 
  AlertTriangle, 
  CloudRain, 
  Sun, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Compass,
  FileText,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { formatCurrency, formatDate, getDisciplineBadgeClass, getHealthBadgeClass } from '../../utils/formatters';

export const DashboardView: React.FC = () => {
  const { 
    projects, 
    tasks, 
    nurseryItems, 
    permits, 
    siteLogs, 
    snags, 
    setActiveTab, 
    setSelectedProjectId,
    disciplineFilter,
    cityFilter,
    searchQuery
  } = useProjects();

  // Filter projects according to global filters
  const filteredProjects = projects.filter(p => {
    if (disciplineFilter !== 'All' && p.discipline !== disciplineFilter) return false;
    if (cityFilter !== 'All' && p.location.city !== cityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchClient = p.client.name.toLowerCase().includes(q) || p.client.organization.toLowerCase().includes(q);
      const matchLoc = p.location.neighborhood.toLowerCase().includes(q) || p.location.city.toLowerCase().includes(q);
      if (!matchName && !matchClient && !matchLoc) return false;
    }
    return true;
  });

  const totalPortfolioValue = projects.reduce((acc, p) => acc + p.budget.contractValue, 0);
  const totalBilled = projects.reduce((acc, p) => acc + p.budget.invoicedAmount, 0);
  const totalReceived = projects.reduce((acc, p) => acc + p.budget.receivedAmount, 0);
  const totalAvailableNurseryFlora = nurseryItems.reduce((acc, n) => acc + n.availableStock, 0);

  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done');
  const criticalPermits = permits.filter(p => p.status === 'Queries Issued' || p.status === 'Pending Submission');
  const openSnags = snags.filter(s => s.status !== 'Resolved & Approved');

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Hero Welcome & Seasonality Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-arabella-950 via-arabella-900 to-[#1A3D24] text-white p-6 sm:p-8 border border-gold-500/20 shadow-md">
        <div className="absolute right-0 top-0 w-96 h-96 bg-radial from-arabella-600/20 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arabella-800/80 border border-gold-400/30 text-gold-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Arabella Landscape & Building Design Workshop (BDW)</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
              Shaping Spaces. Transforming Lives.
            </h1>
            <p className="text-sm text-stone-300 leading-relaxed font-sans">
              Centralized project intelligence managing landscape masterplanning, living bio-facades, civil groundworks, and BDW architectural construction across Nigeria.
            </p>
          </div>

          {/* Real-time Seasonality & Weather Advisory Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 min-w-[260px] space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-200">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-gold-300 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-sky-400" />
                Nigerian Climate Advisory
              </span>
              <span className="text-[10px] bg-sky-500/30 text-sky-200 px-2 py-0.5 rounded-full border border-sky-400/30">
                Lagos & Abuja
              </span>
            </div>
            <div className="text-xs text-stone-300 space-y-1">
              <p className="font-medium text-white flex items-center justify-between">
                <span>Transition to Dry Season</span>
                <span className="text-emerald-300 text-[11px]">Prime Earthworks Window</span>
              </p>
              <p className="text-[11px] text-stone-300 leading-snug">
                Ideal weather for granite paving, deep foundation excavation, and turf aeration before Harmattan winds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-xs font-medium uppercase tracking-wider">Active Contract Book</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            {formatCurrency(totalPortfolioValue)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
            <span>Collected: {formatCurrency(totalReceived)}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {Math.round((totalReceived / totalPortfolioValue) * 100)}%
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-xs font-medium uppercase tracking-wider">Active Commissions</span>
            <Building2 className="w-4 h-4 text-arabella-600 dark:text-arabella-400" />
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            {projects.length} Projects
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
            <span>Lagos &bull; Abuja</span>
            <span className="text-arabella-600 dark:text-arabella-400 font-medium">All On Track</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-xs font-medium uppercase tracking-wider">Nursery Plant Stock</span>
            <Sprout className="w-4 h-4 text-arabella-600 dark:text-arabella-400" />
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            {totalAvailableNurseryFlora.toLocaleString()} Units
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
            <span>Lekki &bull; Epe &bull; Abuja</span>
            <span className="text-arabella-600 dark:text-arabella-400 font-medium">Bio-Wall Ready</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-xs font-medium uppercase tracking-wider">Statutory Clearance</span>
            <ShieldCheck className="w-4 h-4 text-bdw-600 dark:text-bdw-400" />
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            {permits.filter(p => p.status === 'Approved & Stamped').length} / {permits.length}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
            <span>LASPPPA &bull; FCDA</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              {criticalPermits.length} Queries
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects Portfolio on Left + Action/Field Feeds on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Commissions (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                Active Project Commissions
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Showing {filteredProjects.length} projects across Lagos and Abuja
              </p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs font-medium text-arabella-700 dark:text-arabella-400 hover:underline flex items-center gap-1"
            >
              <span>View Full Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setActiveTab('projects');
                }}
                className="group bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-arabella-600 dark:hover:border-arabella-500 transition-all shadow-xs hover:shadow-md cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image cover */}
                  <div className="relative h-36 w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
                    <img
                      src={project.coverImage}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Top badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getDisciplineBadgeClass(project.discipline)}`}>
                        {project.discipline}
                      </span>
                      <span className="text-[10px] font-mono bg-black/60 text-white backdrop-blur-xs px-2 py-0.5 rounded-md">
                        {project.code}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getHealthBadgeClass(project.health)}`}>
                        {project.health}
                      </span>
                    </div>

                    {/* Bottom title on image */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <h3 className="font-serif text-base font-bold text-white group-hover:text-gold-300 transition-colors truncate">
                        {project.name}
                      </h3>
                      <p className="text-[11px] text-stone-200 flex items-center gap-1">
                        <span>{project.location.neighborhood}, {project.location.city}</span>
                        <span>&bull;</span>
                        <span>{project.siteArea}</span>
                      </p>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-3.5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                      <span className="text-stone-500 dark:text-stone-400">Current Phase:</span>
                      <span className="font-semibold text-arabella-900 dark:text-arabella-300 truncate max-w-[180px] text-right">
                        {project.currentStage}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-500 dark:text-stone-400">Stage Gates Completed</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {project.timeline.progressPercentage}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-arabella-700 to-arabella-500 rounded-full transition-all duration-500"
                          style={{ width: `${project.timeline.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Financial & Architect */}
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase">Contract Value</div>
                        <div className="font-semibold text-stone-900 dark:text-stone-100">
                          {formatCurrency(project.budget.contractValue)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-stone-400 uppercase">Lead</div>
                        <div className="font-medium text-stone-700 dark:text-stone-300 text-xs truncate max-w-[130px]">
                          {project.team.leadArchitect}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Studio Operations Feed (1 col) */}
        <div className="space-y-6">
          {/* Daily Site Log Preview */}
          <div className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-arabella-600 dark:text-arabella-400" />
                <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                  Latest Field Dispatch
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('sitelogs')}
                className="text-[11px] text-arabella-700 dark:text-arabella-400 hover:underline"
              >
                All Logs
              </button>
            </div>

            {siteLogs.length > 0 && (
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-arabella-900 dark:text-arabella-300">
                    {siteLogs[0].projectName}
                  </span>
                  <span className="text-stone-400 font-mono">{formatDate(siteLogs[0].date)}</span>
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-300">
                  <span className="font-semibold text-stone-700 dark:text-stone-200">Weather: </span>
                  {siteLogs[0].weather}
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed italic bg-white dark:bg-stone-900 p-2 rounded-lg border border-stone-100 dark:border-stone-800">
                  "{siteLogs[0].architectInstructionIssued || siteLogs[0].completedWorkToday[0]}"
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1">
                  <span>Inspector: {siteLogs[0].inspectedBy}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Verified</span>
                </div>
              </div>
            )}
          </div>

          {/* Urgent Snagging / Quality Items */}
          <div className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                  Punch List & Snags ({openSnags.length})
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('snagging')}
                className="text-[11px] text-arabella-700 dark:text-arabella-400 hover:underline"
              >
                Inspect
              </button>
            </div>

            <div className="space-y-2">
              {openSnags.slice(0, 3).map(snag => (
                <div
                  key={snag.id}
                  className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-amber-400 transition-colors text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 truncate max-w-[190px]">
                      {snag.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-medium">
                      {snag.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                    {snag.projectName} &bull; {snag.locationArea}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Plant Nursery Snapshot */}
          <div className="bg-gradient-to-br from-arabella-950 to-arabella-900 text-stone-100 rounded-xl p-4 border border-gold-500/20 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-gold-400" />
                <h3 className="font-serif text-base font-bold text-white">
                  Arabella Nursery Stock
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('nursery')}
                className="text-[11px] text-gold-300 hover:underline"
              >
                Full Catalog
              </button>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              In-house propagation of native West African architectural species for immediate project dispatch.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="bg-arabella-900/80 p-2 rounded-lg border border-arabella-800">
                <div className="text-[10px] text-stone-400">Specimen Palms</div>
                <div className="font-serif text-base font-bold text-gold-300">48 Units</div>
              </div>
              <div className="bg-arabella-900/80 p-2 rounded-lg border border-arabella-800">
                <div className="text-[10px] text-stone-400">Bio-Wall Trays</div>
                <div className="font-serif text-base font-bold text-gold-300">1,780 Units</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
