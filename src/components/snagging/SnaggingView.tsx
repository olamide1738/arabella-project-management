import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Search, 
  MapPin, 
  User, 
  Filter, 
  Clock, 
  Building2,
  Sparkles
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { SnagItem } from '../../types';
import { formatDate, triggerCelebration } from '../../utils/formatters';

export const SnaggingView: React.FC = () => {
  const { snags, resolveSnag, addSnag, projects } = useProjects();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [isAddSnagOpen, setIsAddSnagOpen] = useState(false);

  // New snag form
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [locationArea, setLocationArea] = useState('Main Arrival Courtyard');
  const [discipline, setDiscipline] = useState<SnagItem['discipline']>('Hardscape');
  const [severity, setSeverity] = useState<SnagItem['severity']>('Standard Snag');
  const [assignedContractorOrTeam, setAssignedContractorOrTeam] = useState('Arabella Stonemason Unit');
  const [reportedBy, setReportedBy] = useState('Tunde Arabella');
  const [description, setDescription] = useState('');

  const filtered = snags.filter(s => {
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    if (severityFilter !== 'All' && s.severity !== severityFilter) return false;
    return true;
  });

  const handleResolve = (id: string) => {
    resolveSnag(id);
    triggerCelebration();
  };

  const handleCreateSnag = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === projectId);
    if (!proj || !title.trim()) return;

    addSnag({
      projectId,
      projectName: proj.name,
      title,
      locationArea,
      discipline,
      severity,
      status: 'Open',
      assignedContractorOrTeam,
      reportedBy,
      description,
    });

    setIsAddSnagOpen(false);
    setTitle('');
    setDescription('');
  };

  const getSeverityBadge = (sev: SnagItem['severity']) => {
    switch (sev) {
      case 'Critical Safety':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      case 'Urgent':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300';
      case 'Standard Snag':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'Cosmetic':
        return 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-300';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 text-[11px] font-bold mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Defect Rectification & Practical Completion</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Snagging & Punch Lists
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Rigorous quality inspection tracking before client handover across paving, living walls, irrigation, and timber pergolas.
          </p>
        </div>

        <button
          onClick={() => setIsAddSnagOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-arabella-900 hover:bg-arabella-800 text-gold-300 text-xs font-semibold border border-gold-500/30 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Snag Item</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1 text-stone-700 dark:text-stone-300"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Rectification In Progress">Rectification In Progress</option>
              <option value="Ready for Re-inspection">Ready for Re-inspection</option>
              <option value="Resolved & Approved">Resolved & Approved</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-stone-400">Severity:</span>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1 text-stone-700 dark:text-stone-300"
            >
              <option value="All">All Severities</option>
              <option value="Critical Safety">Critical Safety</option>
              <option value="Urgent">Urgent</option>
              <option value="Standard Snag">Standard Snag</option>
              <option value="Cosmetic">Cosmetic</option>
            </select>
          </div>
        </div>

        <div className="text-stone-400 text-xs">
          Showing <span className="font-bold text-stone-900 dark:text-stone-100">{filtered.length}</span> punch items
        </div>
      </div>

      {/* Snags Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(snag => (
          <div
            key={snag.id}
            className={`p-4 rounded-2xl border transition-all shadow-xs flex flex-col justify-between space-y-3 ${
              snag.status === 'Resolved & Approved'
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-500/80'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-arabella-800 dark:text-arabella-400">
                  {snag.projectName}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${getSeverityBadge(snag.severity)}`}>
                    {snag.severity}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    snag.status === 'Resolved & Approved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                  }`}>
                    {snag.status}
                  </span>
                </div>
              </div>

              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {snag.title}
              </h3>

              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {snag.description}
              </p>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 grid grid-cols-2 gap-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-arabella-600" />
                  <span className="truncate">{snag.locationArea}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <User className="w-3.5 h-3.5 text-arabella-600" />
                  <span className="truncate">{snag.assignedContractorOrTeam}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-400">
                Reported {formatDate(snag.reportedDate)} by {snag.reportedBy}
              </span>

              {snag.status !== 'Resolved & Approved' ? (
                <button
                  onClick={() => handleResolve(snag.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sign-off & Resolve</span>
                </button>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved on {formatDate(snag.resolvedDate || '')}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Snag Modal */}
      {isAddSnagOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#111714] rounded-2xl w-full max-w-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Raise Snagging / Punch Item
              </h3>
              <button onClick={() => setIsAddSnagOpen(false)} className="text-stone-400 hover:text-stone-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSnag} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold">Project</label>
                <select
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold">Defect Summary / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken sprinkler emitter in zone 3"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">Site Location Area</label>
                  <input
                    type="text"
                    value={locationArea}
                    onChange={e => setLocationArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Severity</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  >
                    <option value="Cosmetic">Cosmetic</option>
                    <option value="Standard Snag">Standard Snag</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical Safety">Critical Safety</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">Discipline</label>
                  <select
                    value={discipline}
                    onChange={e => setDiscipline(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  >
                    <option value="Hardscape">Hardscape</option>
                    <option value="Softscape & Planting">Softscape & Planting</option>
                    <option value="Irrigation & Drainage">Irrigation & Drainage</option>
                    <option value="Architectural Concrete">Architectural Concrete</option>
                    <option value="Exterior Lighting">Exterior Lighting</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Assigned Artisan / Contractor</label>
                  <input
                    type="text"
                    value={assignedContractorOrTeam}
                    onChange={e => setAssignedContractorOrTeam(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold">Defect Details</label>
                <textarea
                  rows={2}
                  placeholder="Describe rectification instructions..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSnagOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-arabella-900 hover:bg-arabella-800 text-gold-300 font-bold"
                >
                  Log Punch Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
