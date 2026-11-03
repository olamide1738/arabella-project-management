import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  DollarSign, 
  FileText, 
  Sprout, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  Award,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Project, StageGateItem } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { 
  formatCurrency, 
  formatDate, 
  getDisciplineBadgeClass, 
  getHealthBadgeClass,
  triggerCelebration 
} from '../../utils/formatters';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  onOpenNewTask: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ 
  project, 
  onClose,
  onOpenNewTask
}) => {
  const { 
    toggleStageGate, 
    tasks, 
    nurseryItems, 
    permits, 
    snags, 
    siteLogs,
    setActiveTab
  } = useProjects();

  const [activeTab, setModalTab] = useState<'overview' | 'stagegates' | 'tasks' | 'sitelogs' | 'snags' | 'nursery'>('overview');

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const projectPermits = permits.filter(p => p.projectId === project.id);
  const projectSnags = snags.filter(s => s.projectId === project.id);
  const projectLogs = siteLogs.filter(l => l.projectId === project.id);
  
  // Find allocated nursery items
  const allocatedFlora = nurseryItems.filter(item =>
    item.allocatedProjects.some(alloc => alloc.projectId === project.id)
  );

  const handleToggleGate = (gateId: string) => {
    toggleStageGate(project.id, gateId);
    triggerCelebration();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#111714] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        
        {/* Header with Cover Banner */}
        <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-stone-900 flex-shrink-0">
          <img
            src={project.coverImage}
            alt={project.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getDisciplineBadgeClass(project.discipline)}`}>
                {project.discipline}
              </span>
              <span className="text-xs font-mono bg-black/70 text-white px-2.5 py-1 rounded-md backdrop-blur-xs">
                {project.code}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getHealthBadgeClass(project.health)}`}>
                {project.health}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Project Title overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {project.name}
            </h2>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-200 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-arabella-400" />
                {project.location.neighborhood}, {project.location.city}
              </span>
              <span>&bull;</span>
              <span>Site Area: {project.siteArea}</span>
              <span>&bull;</span>
              <span>Client: {project.client.organization || project.client.name}</span>
            </div>
          </div>
        </div>

        {/* Modal Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setModalTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-arabella-900 text-gold-300 dark:bg-arabella-950 dark:text-gold-400 font-semibold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Overview & Specifications
          </button>
          <button
            onClick={() => setModalTab('stagegates')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'stagegates'
                ? 'bg-arabella-900 text-gold-300 dark:bg-arabella-950 dark:text-gold-400 font-semibold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>Stage-Gate Approvals</span>
            <span className="bg-gold-500/20 text-gold-400 text-[10px] px-1.5 py-0.2 rounded-full">
              {project.stageGates.filter(g => g.completed).length}/{project.stageGates.length}
            </span>
          </button>
          <button
            onClick={() => setModalTab('tasks')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'bg-arabella-900 text-gold-300 dark:bg-arabella-950 dark:text-gold-400 font-semibold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>Tasks ({projectTasks.length})</span>
          </button>
          <button
            onClick={() => setModalTab('sitelogs')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'sitelogs'
                ? 'bg-arabella-900 text-gold-300 dark:bg-arabella-950 dark:text-gold-400 font-semibold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>Field Reports ({projectLogs.length})</span>
          </button>
          <button
            onClick={() => setModalTab('snags')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'snags'
                ? 'bg-arabella-900 text-gold-300 dark:bg-arabella-950 dark:text-gold-400 font-semibold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>Snagging ({projectSnags.length})</span>
          </button>
          <button
            onClick={() => setModalTab('nursery')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'nursery'
                ? 'bg-arabella-900 text-gold-300 dark:bg-arabella-950 dark:text-gold-400 font-semibold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>Nursery Stock ({allocatedFlora.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial & Timeline Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 dark:bg-stone-900/60 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">Contract Value</span>
                  <div className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                    {formatCurrency(project.budget.contractValue)}
                  </div>
                  <span className="text-[10px] text-stone-400">Actual: {formatCurrency(project.budget.actualCost)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">Invoiced / Paid</span>
                  <div className="font-serif text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(project.budget.receivedAmount)}
                  </div>
                  <span className="text-[10px] text-stone-400">Billed: {formatCurrency(project.budget.invoicedAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">Progress</span>
                  <div className="font-serif text-lg font-bold text-arabella-800 dark:text-arabella-300">
                    {project.timeline.progressPercentage}%
                  </div>
                  <span className="text-[10px] text-stone-400">{project.timeline.daysRemaining} days left</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">Target Handover</span>
                  <div className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                    {formatDate(project.timeline.targetCompletion)}
                  </div>
                  <span className="text-[10px] text-stone-400">Commenced {formatDate(project.timeline.startDate)}</span>
                </div>
              </div>

              {/* Description & Architectural Concept */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  Project Concept & Design Intent
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                  {project.description}
                </p>
                {project.architecturalNote && (
                  <div className="p-3.5 bg-arabella-50 dark:bg-arabella-950/70 border-l-4 border-arabella-700 rounded-r-xl text-xs text-arabella-900 dark:text-arabella-200 leading-relaxed italic">
                    <span className="font-bold not-italic block mb-0.5 text-arabella-950 dark:text-arabella-100">
                      Principal Field & Technical Note:
                    </span>
                    {project.architecturalNote}
                  </div>
                )}
              </div>

              {/* Key Highlights */}
              <div className="space-y-2">
                <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                  Key Scope Elements & Technical Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-arabella-600 dark:text-arabella-400 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team & Client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Team */}
                <div className="bg-stone-50 dark:bg-stone-900/60 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Users className="w-4 h-4 text-arabella-600" />
                    Arabella Project Team
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-400">Lead Architect: </span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">{project.team.leadArchitect}</span>
                      <span className="text-stone-500 block text-[11px]">{project.team.leadArchitectRole}</span>
                    </div>
                    {project.team.landscapeSpecialist && (
                      <div>
                        <span className="text-stone-400">Landscape Lead: </span>
                        <span className="font-medium text-stone-800 dark:text-stone-200">{project.team.landscapeSpecialist}</span>
                      </div>
                    )}
                    {project.team.siteEngineer && (
                      <div>
                        <span className="text-stone-400">Civil/Site Engineer: </span>
                        <span className="font-medium text-stone-800 dark:text-stone-200">{project.team.siteEngineer}</span>
                      </div>
                    )}
                    {project.team.quantitySurveyor && (
                      <div>
                        <span className="text-stone-400">Quantity Surveyor: </span>
                        <span className="font-medium text-stone-800 dark:text-stone-200">{project.team.quantitySurveyor}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Client Representative */}
                <div className="bg-stone-50 dark:bg-stone-900/60 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-gold-500" />
                    Client Profile & Contact
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-400">Client Rep: </span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">{project.client.name}</span>
                    </div>
                    <div>
                      <span className="text-stone-400">Organization: </span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{project.client.organization}</span>
                      <span className="text-[10px] ml-2 px-2 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {project.client.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1 text-stone-600 dark:text-stone-300">
                      <Mail className="w-3.5 h-3.5 text-arabella-600" />
                      <span>{project.client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                      <Phone className="w-3.5 h-3.5 text-arabella-600" />
                      <span>{project.client.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage Gates Tab */}
          {activeTab === 'stagegates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                    Project Stage-Gate Approvals
                  </h3>
                  <p className="text-xs text-stone-500">
                    Click each milestone gate to toggle sign-off. Changes immediately update project progress.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {project.stageGates.map((gate, idx) => (
                  <div
                    key={gate.id}
                    onClick={() => handleToggleGate(gate.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      gate.completed
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-arabella-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {gate.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-stone-400 font-bold">
                            Gate 0{idx + 1}
                          </span>
                          <span className={`text-xs font-semibold ${gate.completed ? 'text-emerald-900 dark:text-emerald-200' : 'text-stone-900 dark:text-stone-100'}`}>
                            {gate.title}
                          </span>
                        </div>
                        {gate.completed && gate.signedOffBy && (
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                            Signed off by {gate.signedOffBy} on {formatDate(gate.signedOffAt || '')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${getDisciplineBadgeClass(gate.discipline)}`}>
                        {gate.discipline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  Committed Action Items ({projectTasks.length})
                </h3>
                <button
                  onClick={onOpenNewTask}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-arabella-900 text-gold-300 text-xs font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              {projectTasks.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No tasks currently recorded for this project.
                </div>
              ) : (
                <div className="space-y-2">
                  {projectTasks.map(t => (
                    <div
                      key={t.id}
                      className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-900 dark:text-stone-100">{t.title}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {t.status.replace('_', ' ')}
                        </span>
                      </div>
                      {t.description && (
                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-snug">{t.description}</p>
                      )}
                      <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-200 dark:border-stone-800">
                        <span>Assigned: {t.assignedTo}</span>
                        <span>Due: {formatDate(t.dueDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Field Reports Tab */}
          {activeTab === 'sitelogs' && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Daily Site Logs for {project.name}
              </h3>
              {projectLogs.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No site logs logged yet for this project.
                </div>
              ) : (
                <div className="space-y-3">
                  {projectLogs.map(l => (
                    <div
                      key={l.id}
                      className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{formatDate(l.date)}</span>
                        <span className="text-stone-500">{l.weather}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-semibold text-stone-700 dark:text-stone-300">Activities Completed:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-stone-600 dark:text-stone-400">
                          {l.completedWorkToday.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                      {l.architectInstructionIssued && (
                        <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 italic">
                          <strong>Site Instruction:</strong> "{l.architectInstructionIssued}"
                        </div>
                      )}
                      <div className="text-[11px] text-stone-400 pt-1">
                        Inspected by: {l.inspectedBy}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Snags Tab */}
          {activeTab === 'snags' && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Snagging & Punch Items ({projectSnags.length})
              </h3>
              {projectSnags.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No open snags recorded for this project.
                </div>
              ) : (
                <div className="space-y-2">
                  {projectSnags.map(s => (
                    <div
                      key={s.id}
                      className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 dark:text-stone-100">{s.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          s.status === 'Resolved & Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-400">{s.description}</p>
                      <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1">
                        <span>Location: {s.locationArea}</span>
                        <span>Assigned: {s.assignedContractorOrTeam}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Nursery Tab */}
          {activeTab === 'nursery' && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Arabella Nursery Flora Allocated to {project.name}
              </h3>
              {allocatedFlora.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No plants currently reserved for this project from the Arabella nursery.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allocatedFlora.map(item => {
                    const alloc = item.allocatedProjects.find(a => a.projectId === project.id);
                    return (
                      <div
                        key={item.id}
                        className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex gap-3 items-center"
                      >
                        <img
                          src={item.photoUrl}
                          alt={item.commonName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1 text-xs space-y-1">
                          <h4 className="font-bold text-stone-900 dark:text-stone-100 truncate">
                            {item.commonName}
                          </h4>
                          <p className="text-[11px] italic text-stone-500 truncate">{item.scientificName}</p>
                          <div className="flex items-center justify-between text-[11px] text-arabella-800 dark:text-arabella-300 font-semibold pt-1">
                            <span>Reserved: {alloc?.quantity} units</span>
                            <span>{item.containerSize}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
