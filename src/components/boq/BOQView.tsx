import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { BOQItem } from '../../types';
import { formatCurrency, formatExactCurrency, triggerCelebration } from '../../utils/formatters';

export const BOQView: React.FC = () => {
  const { boqItems, updateBOQClaim, addBOQItem, projects } = useProjects();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [isAddBOQOpen, setIsAddBOQOpen] = useState(false);

  // New BOQ state
  const [itemNumber, setItemNumber] = useState('DIV 04 - Masonry & Granite Paving');
  const [description, setDescription] = useState('600x600 flamed natural granite paving on 50mm mortar bed');
  const [unit, setUnit] = useState<BOQItem['unit']>('m²');
  const [quantity, setQuantity] = useState(650);
  const [rateNGN, setRateNGN] = useState(48000);
  const [discipline, setDiscipline] = useState<BOQItem['discipline']>('Landscape');

  const filteredBOQ = boqItems.filter(b => b.projectId === selectedProjectId);
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const totalContract = filteredBOQ.reduce((acc, b) => acc + b.totalNGN, 0);
  const totalCertified = filteredBOQ.reduce((acc, b) => acc + b.certifiedAmountNGN, 0);
  const overallClaimPercent = totalContract > 0 ? Math.round((totalCertified / totalContract) * 100) : 0;

  const handleClaimChange = (id: string, pct: number) => {
    updateBOQClaim(id, pct);
    if (pct === 100) {
      triggerCelebration();
    }
  };

  const handleCreateBOQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !description.trim()) return;

    const totalNGN = quantity * rateNGN;
    addBOQItem({
      projectId: selectedProjectId,
      itemNumber,
      description,
      unit,
      quantity,
      rateNGN,
      totalNGN,
      discipline,
      claimedPercentage: 0,
      certifiedAmountNGN: 0,
      status: 'In Budget',
    });

    setIsAddBOQOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-bold mb-1">
            <Calculator className="w-3.5 h-3.5" />
            <span>Quantity Surveying & Interim Payment Certificates</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Bill of Quantities (BOQ) & Cashflow
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Certified contract schedules and material valuation breakdowns in Nigerian Naira (₦).
          </p>
        </div>

        <button
          onClick={() => setIsAddBOQOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-arabella-900 hover:bg-arabella-800 text-gold-300 text-xs font-semibold border border-gold-500/30 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add BOQ Division Line</span>
        </button>
      </div>

      {/* Project Switcher Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Target Project:</span>
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="text-xs font-semibold bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-1.5 text-stone-900 dark:text-stone-100 cursor-pointer"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.code} &bull; {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-[10px] text-stone-400 uppercase">Total Schedule</span>
            <div className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
              {formatExactCurrency(totalContract)}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase">Certified to Date</span>
            <div className="font-serif text-base font-bold text-emerald-600 dark:text-emerald-400">
              {formatExactCurrency(totalCertified)} ({overallClaimPercent}%)
            </div>
          </div>
        </div>
      </div>

      {/* BOQ Schedule Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 uppercase text-[10px] font-bold tracking-wider text-stone-500">
              <tr>
                <th className="py-3 px-4">Division Code & Scope</th>
                <th className="py-3 px-4">Quantity & Unit</th>
                <th className="py-3 px-4">Unit Rate (NGN)</th>
                <th className="py-3 px-4">Total Contract Value</th>
                <th className="py-3 px-4 min-w-[200px]">Claimed Progress</th>
                <th className="py-3 px-4 text-right">Certified Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredBOQ.map(item => (
                <tr key={item.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900 dark:text-stone-100">
                      {item.itemNumber}
                    </div>
                    <div className="text-[11px] text-stone-500 leading-snug max-w-sm">
                      {item.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {item.quantity.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {formatExactCurrency(item.rateNGN)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900 dark:text-stone-100">
                    {formatExactCurrency(item.totalNGN)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-stone-600 dark:text-stone-300">Valuation:</span>
                        <span className="font-bold text-arabella-800 dark:text-arabella-300">
                          {item.claimedPercentage}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={item.claimedPercentage}
                        onChange={e => handleClaimChange(item.id, Number(e.target.value))}
                        className="w-full accent-arabella-600 cursor-pointer h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatExactCurrency(item.certifiedAmountNGN)}
                  </td>
                </tr>
              ))}

              {filteredBOQ.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400 italic">
                    No BOQ lines registered yet for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add BOQ Line Modal */}
      {isAddBOQOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#111714] rounded-2xl w-full max-w-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Add BOQ Division Line Item
              </h3>
              <button onClick={() => setIsAddBOQOpen(false)} className="text-stone-400 hover:text-stone-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateBOQ} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold">Division / Trade Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIV 32 - Smart Irrigation Automation"
                  value={itemNumber}
                  onChange={e => setItemNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold">Scope Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">Unit</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  >
                    <option value="m²">m² (Paving/Turf)</option>
                    <option value="m³">m³ (Earthworks)</option>
                    <option value="lin.m">lin.m (Trellis/Curb)</option>
                    <option value="item">item (Lump Sum)</option>
                    <option value="nr">nr (Specimen Trees)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Rate (NGN ₦)</label>
                  <input
                    type="number"
                    value={rateNGN}
                    onChange={e => setRateNGN(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <span className="font-bold">Calculated Line Total:</span>
                <span className="font-mono font-bold text-arabella-900 dark:text-arabella-300 text-sm">
                  {formatExactCurrency(quantity * rateNGN)}
                </span>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBOQOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-arabella-900 hover:bg-arabella-800 text-gold-300 font-bold"
                >
                  Save Schedule Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
