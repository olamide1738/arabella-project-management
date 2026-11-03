import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Download, 
  Camera, 
  Award, 
  FileCheck,
  Send,
  MessageSquare
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { formatCurrency, formatDate, getHealthBadgeClass } from '../../utils/formatters';

export const ClientPortalView: React.FC = () => {
  const { projects, selectedProjectId, setSelectedProjectId } = useProjects();
  const [activeProjectId, setActiveProjectId] = useState<string>(selectedProjectId || projects[0]?.id || '');
  const [clientMessage, setClientMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const project = projects.find(p => p.id === activeProjectId) || projects[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientMessage.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setClientMessage('');
      setMessageSent(false);
    }, 4000);
  };

  if (!project) return null;

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* VIP Client Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-arabella-950 via-stone-900 to-[#122317] border border-gold-500/30 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-arabella-900 border border-gold-400/40 flex items-center justify-center font-serif text-2xl font-bold text-gold-400">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-white">
                  Arabella Client Executive Suite
                </span>
                <span className="text-[10px] font-mono uppercase bg-gold-400/20 text-gold-300 px-2 py-0.5 rounded border border-gold-400/30">
                  Private & Confidential
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Live delivery progress, quality certifications, and site dispatches for {project.client.organization}.
              </p>
            </div>
          </div>

          {/* Switch Client Profile */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">Viewing Commission:</span>
            <select
              value={activeProjectId}
              onChange={e => setActiveProjectId(e.target.value)}
              className="text-xs font-semibold bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-gold-300 cursor-pointer"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.client.organization})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Project Overview Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
        {/* Cover Photo */}
        <div className="relative h-64 w-full bg-stone-900">
          <img
            src={project.coverImage}
            alt={project.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-gold-400 font-bold">{project.code}</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {project.name}
              </h2>
              <div className="flex items-center gap-2 text-stone-300 text-xs mt-1">
                <MapPin className="w-3.5 h-3.5 text-arabella-400" />
                <span>{project.location.address}</span>
                <span>&bull;</span>
                <span>{project.siteArea}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-md border ${getHealthBadgeClass(project.health)}`}>
                Status: {project.health}
              </span>
            </div>
          </div>
        </div>

        {/* Executive Summary Stats */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold">Overall Progress</span>
            <div className="font-serif text-2xl font-bold text-arabella-800 dark:text-arabella-300">
              {project.timeline.progressPercentage}%
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-arabella-600 rounded-full" style={{ width: `${project.timeline.progressPercentage}%` }} />
            </div>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold">Target Handover</span>
            <div className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
              {formatDate(project.timeline.targetCompletion)}
            </div>
            <div className="text-[11px] text-stone-500">{project.timeline.daysRemaining} days remaining</div>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold">Current Milestone</span>
            <div className="font-medium text-xs text-stone-800 dark:text-stone-200 mt-1 truncate">
              {project.currentStage}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400">On Programme</div>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold">Certified Valuation</span>
            <div className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 font-mono">
              {formatCurrency(project.budget.receivedAmount)}
            </div>
            <div className="text-[11px] text-stone-500">Contract: {formatCurrency(project.budget.contractValue)}</div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* Principal Architect Dispatch */}
          <div className="p-5 bg-arabella-50 dark:bg-arabella-950/40 rounded-2xl border border-arabella-200 dark:border-arabella-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-arabella-700 dark:text-arabella-400" />
                <h3 className="font-serif text-base font-bold text-arabella-950 dark:text-stone-100">
                  Principal Architect's Weekly Dispatch
                </h3>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">
                Issued by {project.team.leadArchitect}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
              "We are pleased to report substantial progress on the {project.name}. The civil foundations and structural steel framing have passed local regulatory inspections. Our in-house nursery has pre-rooted the specimen tropical flora, and automated drip irrigation lines have undergone initial pressure testing. All works continue in strict adherence to drawing tolerances."
            </p>

            <div className="pt-2 border-t border-arabella-200 dark:border-arabella-800 flex items-center justify-between text-xs text-arabella-900 dark:text-arabella-300">
              <span className="font-serif font-bold italic">&mdash; {project.team.leadArchitect}, {project.team.leadArchitectRole}</span>
              <span className="text-[11px] bg-white dark:bg-stone-900 px-2.5 py-1 rounded-md border border-arabella-200 dark:border-arabella-800">
                Official Studio Seal &bull; Arabella Atelier
              </span>
            </div>
          </div>

          {/* Project Highlights Grid */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              Approved Commission Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {project.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-stone-700 dark:text-stone-300">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Communication to Studio */}
          <div className="p-5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-arabella-600" />
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                Direct Communication with Principal Team
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Submit a formal request, variation inquiry, or site meeting booking directly to Tunde Arabella and BDW directors.
            </p>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="Type your instruction, question, or inquiry here..."
                value={clientMessage}
                onChange={e => setClientMessage(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-arabella-600"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-arabella-600" />
                    +234 800 123 4567
                  </span>
                  <span>&bull;</span>
                  <span>atelier@arabellalandscape.com</span>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-arabella-900 hover:bg-arabella-800 text-gold-300 text-xs font-bold border border-gold-500/30 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to Studio</span>
                </button>
              </div>

              {messageSent && (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-medium animate-fade-in">
                  Transmitted successfully to Principal Landscape Architect Tunde Arabella &amp; BDW Director. Expected response within 2 hours.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
