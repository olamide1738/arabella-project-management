import React, { useState } from 'react';
import { X, Building2, MapPin, DollarSign, Calendar, Users, Sparkles } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { Discipline, ProjectCategory, ProjectStage, ProjectHealth } from '../../types';
import { triggerCelebration } from '../../utils/formatters';

interface NewProjectModalProps {
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose }) => {
  const { addProject } = useProjects();

  const [name, setName] = useState('');
  const [code, setCode] = useState(`ARB-2024-${Math.floor(100 + Math.random() * 900)}`);
  const [discipline, setDiscipline] = useState<Discipline>('Landscape');
  const [category, setCategory] = useState<ProjectCategory>('Commercial');
  const [currentStage, setCurrentStage] = useState<ProjectStage>('Inception & Brief');
  const [siteArea, setSiteArea] = useState('2,500 m²');
  
  // Location
  const [city, setCity] = useState<'Lagos' | 'Abuja' | 'Port Harcourt' | 'Ibadan'>('Lagos');
  const [neighborhood, setNeighborhood] = useState('Ikoyi');
  const [address, setAddress] = useState('');

  // Client
  const [clientName, setClientName] = useState('');
  const [clientOrg, setClientOrg] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientType, setClientType] = useState<'Corporate' | 'Private HNI' | 'Government' | 'Real Estate Developer'>('Corporate');

  // Budget
  const [contractValue, setContractValue] = useState<number>(350000000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetCompletion, setTargetCompletion] = useState('2025-06-30');

  // Team
  const [leadArchitect, setLeadArchitect] = useState('Tunde Arabella');
  const [leadArchitectRole, setLeadArchitectRole] = useState('Principal Landscape Architect');

  // Highlights
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=1200&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject({
      code,
      name,
      client: {
        name: clientName || 'Client Representative',
        organization: clientOrg || name,
        email: clientEmail || 'client@example.com',
        phone: clientPhone || '+234 800 000 0000',
        type: clientType,
      },
      discipline,
      category,
      currentStage,
      health: 'On Track',
      siteArea,
      location: {
        city,
        neighborhood: neighborhood || city,
        address: address || `${neighborhood}, ${city}, Nigeria`,
        coordinates: city === 'Abuja' ? [9.0579, 7.4951] : [6.4541, 3.4297],
      },
      timeline: {
        startDate,
        targetCompletion,
        progressPercentage: 15,
        daysRemaining: 180,
      },
      budget: {
        currency: 'NGN',
        contractValue,
        estimatedCost: Math.round(contractValue * 0.85),
        actualCost: 0,
        invoicedAmount: Math.round(contractValue * 0.2),
        receivedAmount: Math.round(contractValue * 0.2),
      },
      team: {
        leadArchitect,
        leadArchitectRole,
        assignedMembers: [leadArchitect],
      },
      description: description || 'New architectural or landscape design commission for Arabella Landscape / BDW Studio.',
      highlights: [
        'Site survey and topographic leveling',
        'Custom masterplanning and 3D visualization package',
        'SuDS drainage and automated irrigation integration',
      ],
      coverImage: coverImage || 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1200&q=80',
      images: [coverImage],
      stageGates: [
        { id: `sg-${Date.now()}-1`, title: 'Discovery & Client Brief Sign-off', discipline, completed: true, requiredForSignoff: true, signedOffBy: leadArchitect, signedOffAt: new Date().toISOString().split('T')[0] },
        { id: `sg-${Date.now()}-2`, title: 'Topographical Survey & Sun Path Modeling', discipline, completed: false, requiredForSignoff: true },
        { id: `sg-${Date.now()}-3`, title: 'Concept Design & 3D Render Presentation', discipline, completed: false, requiredForSignoff: true },
        { id: `sg-${Date.now()}-4`, title: 'Statutory Approval Filing (LASPPPA/FCDA)', discipline, completed: false, requiredForSignoff: true },
        { id: `sg-${Date.now()}-5`, title: 'Civil Groundworks & Subgrade Earthworks', discipline, completed: false, requiredForSignoff: true },
        { id: `sg-${Date.now()}-6`, title: 'Hardscape & Bio-Structure Construction', discipline, completed: false, requiredForSignoff: true },
        { id: `sg-${Date.now()}-7`, title: 'Softscape & Nursery Species Planting', discipline, completed: false, requiredForSignoff: true },
        { id: `sg-${Date.now()}-8`, title: 'Snagging, Handover & Practical Completion', discipline, completed: false, requiredForSignoff: true },
      ],
      tags: [discipline, category, city, neighborhood],
      isFeatured: false,
    });

    triggerCelebration();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#111714] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900">
          <div className="flex items-center gap-2">
            <div className="h-8 px-2 py-0.5 rounded-lg bg-white dark:bg-white/95 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-xs">
              <img src="/arabella-logo.png" alt="Arabella" className="h-5 w-auto object-contain" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                New Project Commission
              </h2>
              <p className="text-[11px] text-stone-500">
                Commission a landscape masterplan or BDW architectural project
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs custom-scrollbar">
          {/* Project Title & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Project Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Eko Atlantic Waterfront Promenade"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-arabella-600"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Project Code</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 font-mono"
              />
            </div>
          </div>

          {/* Discipline & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Discipline</label>
              <select
                value={discipline}
                onChange={e => {
                  const val = e.target.value as Discipline;
                  setDiscipline(val);
                  if (val === 'Architecture') {
                    setLeadArchitect('Arc. Damilola Wright (BDW)');
                    setLeadArchitectRole('Principal Architect (Building Design Workshop)');
                  } else {
                    setLeadArchitect('Tunde Arabella');
                    setLeadArchitectRole('Principal Landscape Architect');
                  }
                }}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="Landscape">Landscape Architecture (Arabella)</option>
                <option value="Architecture">Building Architecture (BDW)</option>
                <option value="Integrated Design-Build">Integrated Design-Build</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Civic & Public Space">Civic & Public Space</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Mixed-Use">Mixed-Use</option>
                <option value="Masterplan">Masterplan</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Site Area</label>
              <input
                type="text"
                placeholder="e.g. 1.5 Hectares or 3,000 m²"
                value={siteArea}
                onChange={e => setSiteArea(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          {/* Location in Nigeria */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">City (Nigeria)</label>
              <select
                value={city}
                onChange={e => setCity(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Port Harcourt">Port Harcourt</option>
                <option value="Ibadan">Ibadan</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Neighborhood / District</label>
              <input
                type="text"
                placeholder="e.g. Ikoyi / Maitama / Lekki"
                value={neighborhood}
                onChange={e => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Street Address</label>
              <input
                type="text"
                placeholder="e.g. Plot 15, Queen's Drive"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          {/* Client & Contract Value */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Client / Organization</label>
              <input
                type="text"
                placeholder="e.g. Access Bank / Private Villa"
                value={clientOrg}
                onChange={e => setClientOrg(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Contract Value (NGN ₦)</label>
              <input
                type="number"
                value={contractValue}
                onChange={e => setContractValue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Client Sector</label>
              <select
                value={clientType}
                onChange={e => setClientType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="Corporate">Corporate</option>
                <option value="Private HNI">Private HNI</option>
                <option value="Government">Government / Public Agency</option>
                <option value="Real Estate Developer">Real Estate Developer</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-stone-700 dark:text-stone-300">Scope & Design Brief</label>
            <textarea
              rows={3}
              placeholder="Describe the architectural or landscape concept, key features, living wall requirements, etc..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-arabella-900 hover:bg-arabella-800 text-gold-300 font-bold border border-gold-500/30 shadow-sm"
            >
              Create Commission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
