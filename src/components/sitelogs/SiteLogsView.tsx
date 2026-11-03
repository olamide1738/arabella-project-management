import React, { useState } from 'react';
import { 
  ClipboardList, 
  CloudRain, 
  Sun, 
  Users, 
  Truck, 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  Camera, 
  FileText,
  Calendar
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { SiteLog } from '../../types';
import { formatDate } from '../../utils/formatters';

export const SiteLogsView: React.FC = () => {
  const { siteLogs, addSiteLog, projects } = useProjects();

  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weather, setWeather] = useState<SiteLog['weather']>('Sunny & Clear (32°C)');
  const [rainDelayHours, setRainDelayHours] = useState(0);
  
  // Labor headcount
  const [masons, setMasons] = useState(4);
  const [pavers, setPavers] = useState(6);
  const [horticulturists, setHorticulturists] = useState(8);
  const [irrigationPlumbers, setIrrigationPlumbers] = useState(2);
  const [weldersAndCarpenters, setWeldersAndCarpenters] = useState(3);
  const [generalHelpers, setGeneralHelpers] = useState(10);
  const [supervisors, setSupervisors] = useState(2);

  const [equipmentText, setEquipmentText] = useState('1x JCB Telehandler, 1x Plate Compactor');
  const [activitiesText, setActivitiesText] = useState('Mounted 120 living wall trays; completed flamed granite curb leveling.');
  const [architectInstruction, setArchitectInstruction] = useState('Check expansion joint sealants on south perimeter wall.');
  const [inspectedBy, setInspectedBy] = useState('Folashade Adeleke & Engr. Babatunde Oshinowo');

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    addSiteLog({
      projectId,
      projectName: proj.name,
      date,
      weather,
      rainDelayHours,
      laborHeadcount: {
        masons,
        pavers,
        horticulturists,
        irrigationPlumbers,
        weldersAndCarpenters,
        generalHelpers,
        supervisors,
      },
      heavyEquipment: equipmentText.split(',').map(s => s.trim()).filter(Boolean),
      completedWorkToday: activitiesText.split(';').map(s => s.trim()).filter(Boolean),
      siteSafetyIssues: 'Morning toolbox safety talk conducted at 07:30. Zero injuries or near-misses.',
      inspectedBy,
      architectInstructionIssued: architectInstruction,
      photos: [
        { caption: 'Daily site progress inspection', url: proj.coverImage }
      ],
    });

    setIsAddLogOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-arabella-100 text-arabella-900 dark:bg-arabella-950 dark:text-arabella-300 text-[11px] font-bold mb-1">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Site Supervision & Quality Assurance</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Daily Field Reports & Construction Logs
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Official daily diary capturing weather downtime, artisan headcounts, equipment deployment, and architect instructions.
          </p>
        </div>

        <button
          onClick={() => setIsAddLogOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-arabella-900 hover:bg-arabella-800 text-gold-300 text-xs font-semibold border border-gold-500/30 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Daily Field Log</span>
        </button>
      </div>

      {/* Logs Feed */}
      <div className="space-y-5">
        {siteLogs.map(log => {
          const totalArtisans = Object.values(log.laborHeadcount).reduce((a, b) => a + b, 0);

          return (
            <div
              key={log.id}
              className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-arabella-700 dark:text-arabella-400 bg-arabella-50 dark:bg-arabella-950 px-2 py-0.5 rounded">
                      {formatDate(log.date)}
                    </span>
                    <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                      {log.projectName}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Inspected & logged by: <span className="font-medium text-stone-800 dark:text-stone-200">{log.inspectedBy}</span>
                  </p>
                </div>

                {/* Weather Pill */}
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2.5 py-1 rounded-md font-medium border flex items-center gap-1.5 ${
                    log.rainDelayHours > 0
                      ? 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {log.rainDelayHours > 0 ? <CloudRain className="w-3.5 h-3.5 text-sky-600" /> : <Sun className="w-3.5 h-3.5 text-amber-600" />}
                    <span>{log.weather}</span>
                  </span>
                  {log.rainDelayHours > 0 && (
                    <span className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[11px] font-bold px-2 py-0.5 rounded">
                      {log.rainDelayHours}h Rain Delay
                    </span>
                  )}
                </div>
              </div>

              {/* Labor & Equipment Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Total Site Headcount</span>
                  <div className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                    {totalArtisans} Artisans
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {log.laborHeadcount.horticulturists} Horticulturists &bull; {log.laborHeadcount.pavers} Pavers
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Civil & Masons</span>
                  <div className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                    {log.laborHeadcount.masons} Masons
                  </div>
                  <div className="text-[11px] text-stone-500">{log.laborHeadcount.weldersAndCarpenters} Joiners/Welders</div>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Irrigation Plumbing</span>
                  <div className="font-serif text-lg font-bold text-arabella-800 dark:text-arabella-400">
                    {log.laborHeadcount.irrigationPlumbers} Specialists
                  </div>
                  <div className="text-[11px] text-stone-500">Hunter Wi-Fi Calibration</div>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Plant & Machinery</span>
                  <div className="text-stone-800 dark:text-stone-200 font-medium truncate">
                    {log.heavyEquipment.join(', ') || 'Manual Tools Only'}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400">All Certified Safe</div>
                </div>
              </div>

              {/* Activities Completed */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-stone-900 dark:text-stone-100">Works Executed Today:</span>
                <ul className="space-y-1">
                  {log.completedWorkToday.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-arabella-600 mt-0.5 flex-shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Architect Instruction */}
              {log.architectInstructionIssued && (
                <div className="p-3 bg-arabella-50 dark:bg-arabella-950/70 rounded-xl border border-arabella-200 dark:border-arabella-800 text-xs text-arabella-950 dark:text-arabella-200 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-arabella-800 dark:text-arabella-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Formal Site Instruction (Architect / Lead Engineer):
                  </span>
                  <p className="italic">"{log.architectInstructionIssued}"</p>
                </div>
              )}

              {/* Photos preview */}
              {log.photos && log.photos.length > 0 && (
                <div className="flex items-center gap-3 pt-1">
                  {log.photos.map((ph, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-stone-500 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg">
                      <Camera className="w-3.5 h-3.5 text-arabella-600" />
                      <span>{ph.caption}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Log Modal */}
      {isAddLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#111714] rounded-2xl w-full max-w-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Log Daily Site Report
              </h3>
              <button onClick={() => setIsAddLogOpen(false)} className="text-stone-400 hover:text-stone-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
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
                  <label className="font-bold">Inspection Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">Weather Condition</label>
                  <select
                    value={weather}
                    onChange={e => setWeather(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  >
                    <option value="Sunny & Clear (32°C)">Sunny & Clear (32°C)</option>
                    <option value="Heavy Torrential Downpour (Lagos Wet Season)">Heavy Torrential Downpour (Lagos Wet Season)</option>
                    <option value="Scattered Showers">Scattered Showers</option>
                    <option value="Harmattan Dust Haze (Abuja)">Harmattan Dust Haze (Abuja)</option>
                    <option value="Overcast & Humid">Overcast & Humid</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Rain Delay Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={rainDelayHours}
                    onChange={e => setRainDelayHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold">Activities Executed (separated by semicolon ';')</label>
                <textarea
                  rows={2}
                  value={activitiesText}
                  onChange={e => setActivitiesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold">Architect Site Instruction Issued</label>
                <textarea
                  rows={2}
                  value={architectInstruction}
                  onChange={e => setArchitectInstruction(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLogOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-arabella-900 hover:bg-arabella-800 text-gold-300 font-bold"
                >
                  Commit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
