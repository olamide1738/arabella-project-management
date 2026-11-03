import React, { useState } from 'react';
import { X, CheckSquare, Calendar, User, AlertCircle, CloudRain } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { Discipline, ProjectStage, Task } from '../../types';

interface NewTaskModalProps {
  onClose: () => void;
  defaultStatus?: Task['status'];
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ 
  onClose,
  defaultStatus = 'todo' 
}) => {
  const { projects, addTask, selectedProjectId } = useProjects();

  const [projectId, setProjectId] = useState(selectedProjectId || (projects[0]?.id || ''));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>(defaultStatus);
  const [priority, setPriority] = useState<Task['priority']>('high');
  const [discipline, setDiscipline] = useState<Discipline>('Landscape');
  const [stage, setStage] = useState<ProjectStage>('Softscaping & Nursery Planting');
  const [assignedTo, setAssignedTo] = useState('Folashade Adeleke');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [estimatedHours, setEstimatedHours] = useState(16);
  const [isWeatherSensitive, setIsWeatherSensitive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    addTask({
      projectId,
      title,
      description,
      stage,
      discipline,
      status,
      priority,
      assignedTo,
      dueDate,
      estimatedHours,
      loggedHours: 0,
      isWeatherSensitive,
      tags: [discipline, priority],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#111714] rounded-2xl w-full max-w-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-arabella-600" />
            <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              New Studio Work Item
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Target Project */}
          <div className="space-y-1">
            <label className="font-bold text-stone-700 dark:text-stone-300">Target Project *</label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 font-medium"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} &bull; {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="font-bold text-stone-700 dark:text-stone-300">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Calibrate living wall micro-drip emitters"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Initial Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Inspection & Review</option>
                <option value="done">Completed</option>
                <option value="backlog">Backlog</option>
              </select>
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Assignee</label>
              <input
                type="text"
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                placeholder="e.g. Folashade Adeleke"
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">Target Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          {/* Weather Sensitive Checkbox */}
          <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-100 block">Weather Sensitive Work</span>
                <span className="text-[11px] text-stone-500">Requires dry weather (earthworks, turf laying, stone mortar)</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isWeatherSensitive}
              onChange={e => setIsWeatherSensitive(e.target.checked)}
              className="w-4 h-4 text-arabella-600 rounded focus:ring-arabella-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-stone-700 dark:text-stone-300">Scope Instructions</label>
            <textarea
              rows={2}
              placeholder="Detailed instructions for site engineer or artisan team..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Footer */}
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
              className="px-5 py-2 rounded-lg bg-arabella-900 hover:bg-arabella-800 text-gold-300 font-bold border border-gold-500/30"
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
