import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ExternalLink,
  Info
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { StatutoryPermit } from '../../types';
import { formatDate, formatExactCurrency, triggerCelebration } from '../../utils/formatters';

export const StatutoryPermitsView: React.FC = () => {
  const { permits, updatePermitStatus, addPermit, projects } = useProjects();

  const [agencyFilter, setAgencyFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isNewPermitOpen, setIsNewPermitOpen] = useState(false);

  // New permit form
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [regulatoryBody, setRegulatoryBody] = useState<StatutoryPermit['regulatoryBody']>('LASPPPA');
  const [permitType, setPermitType] = useState('Planning Permit (Commercial Facade & Setback)');
  const [referenceNumber, setReferenceNumber] = useState(`LASPPPA/EP/2024/${Math.floor(100 + Math.random() * 900)}`);
  const [targetApprovalDate, setTargetApprovalDate] = useState('2024-12-15');
  const [assignedExpediter, setAssignedExpediter] = useState('Arc. Damilola Wright (BDW)');
  const [feePaidNGN, setFeePaidNGN] = useState(2500000);
  const [notes, setNotes] = useState('');

  const filtered = permits.filter(p => {
    if (agencyFilter !== 'All' && p.regulatoryBody !== agencyFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = (id: string, newStatus: StatutoryPermit['status']) => {
    updatePermitStatus(id, newStatus);
    if (newStatus === 'Approved & Stamped') {
      triggerCelebration();
    }
  };

  const handleCreatePermit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    addPermit({
      projectId,
      projectName: proj.name,
      regulatoryBody,
      permitType,
      referenceNumber,
      status: 'Under Review',
      submissionDate: new Date().toISOString().split('T')[0],
      targetApprovalDate,
      assignedExpediter,
      feePaidNGN,
      conditionsCount: 0,
      documents: [{ name: 'Architectural Submission Package.pdf', url: '#', date: new Date().toISOString().split('T')[0] }],
      notes,
    });

    setIsNewPermitOpen(false);
  };

  const getStatusBadge = (status: StatutoryPermit['status']) => {
    switch (status) {
      case 'Approved & Stamped':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      case 'Queries Issued':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      case 'Pending Submission':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'Renewal Needed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-bdw-100 text-bdw-800 dark:bg-bdw-950 dark:text-bdw-300 text-[11px] font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Nigerian Real Estate Compliance & Development Control</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Statutory Approvals & Permitting Tracker
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Monitor approvals across LASPPPA, LABSCA, Lagos Drainage, and Abuja FCDA Development Control.
          </p>
        </div>

        <button
          onClick={() => setIsNewPermitOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-arabella-900 hover:bg-arabella-800 text-gold-300 text-xs font-semibold border border-gold-500/30 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Filing</span>
        </button>
      </div>

      {/* Agency Guide Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
          <div className="font-bold text-stone-900 dark:text-stone-100">LASPPPA (Lagos)</div>
          <p className="text-[11px] text-stone-500">Planning & zoning permit, building envelope, road setback</p>
        </div>
        <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
          <div className="font-bold text-stone-900 dark:text-stone-100">LABSCA (Lagos)</div>
          <p className="text-[11px] text-stone-500">Building control, piling verification, concrete pour certificate</p>
        </div>
        <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
          <div className="font-bold text-stone-900 dark:text-stone-100">FCDA (Abuja)</div>
          <p className="text-[11px] text-stone-500">Development Control, hillside contour & beacon approvals</p>
        </div>
        <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
          <div className="font-bold text-stone-900 dark:text-stone-100">Drainage Dept (SuDS)</div>
          <p className="text-[11px] text-stone-500">Zero stormwater surcharge into public channels, retention</p>
        </div>
      </div>

      {/* Permits List */}
      <div className="space-y-4">
        {filtered.map(permit => (
          <div
            key={permit.id}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {permit.regulatoryBody}
                  </span>
                  <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                    {permit.permitType}
                  </h3>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Commission: <span className="font-semibold text-arabella-900 dark:text-arabella-300">{permit.projectName}</span> &bull; File Ref: <span className="font-mono">{permit.referenceNumber}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getStatusBadge(permit.status)}`}>
                  {permit.status}
                </span>

                <select
                  value={permit.status}
                  onChange={e => handleStatusChange(permit.id, e.target.value as any)}
                  className="text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1 text-stone-700 dark:text-stone-200"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Queries Issued">Queries Issued</option>
                  <option value="Approved & Stamped">Approved & Stamped</option>
                  <option value="Pending Submission">Pending Submission</option>
                </select>
              </div>
            </div>

            {/* Notes & Expediter Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs border border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400">Expediter & Case Officer</span>
                <div className="font-medium text-stone-800 dark:text-stone-200">{permit.assignedExpediter}</div>
                {permit.caseOfficer && <div className="text-[11px] text-stone-500">{permit.caseOfficer}</div>}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400">Timelines</span>
                <div className="text-stone-800 dark:text-stone-200">Submitted: {formatDate(permit.submissionDate)}</div>
                <div className="text-stone-500">
                  {permit.actualApprovalDate ? `Approved: ${formatDate(permit.actualApprovalDate)}` : `Target: ${formatDate(permit.targetApprovalDate)}`}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400">Statutory Assessment Fee</span>
                <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  {formatExactCurrency(permit.feePaidNGN)}
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 text-[11px]">Official Treasury Receipt Verified</div>
              </div>
            </div>

            {permit.notes && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                <strong>Regulatory Notes / Query Conditions:</strong> {permit.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Filing Modal */}
      {isNewPermitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#111714] rounded-2xl w-full max-w-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Register Statutory Permit Filing
              </h3>
              <button onClick={() => setIsNewPermitOpen(false)} className="text-stone-400 hover:text-stone-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreatePermit} className="p-5 space-y-4 text-xs">
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">Regulatory Authority</label>
                  <select
                    value={regulatoryBody}
                    onChange={e => setRegulatoryBody(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  >
                    <option value="LASPPPA">LASPPPA (Lagos Physical Planning)</option>
                    <option value="LABSCA">LABSCA (Lagos Building Control)</option>
                    <option value="FCDA Abuja">FCDA Development Control (Abuja)</option>
                    <option value="Lagos Drainage Dept">Lagos State Drainage & SuDS</option>
                    <option value="EIA Federal">Federal Ministry of Environment (EIA)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Permit / Approval Type</label>
                  <input
                    type="text"
                    required
                    value={permitType}
                    onChange={e => setPermitType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">Filing Reference Number</label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={e => setReferenceNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Statutory Fee (NGN ₦)</label>
                  <input
                    type="number"
                    value={feePaidNGN}
                    onChange={e => setFeePaidNGN(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold">Permit Notes & Conditions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Setback clearances, query responses..."
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPermitOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-arabella-900 hover:bg-arabella-800 text-gold-300 font-bold"
                >
                  Save Filing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
