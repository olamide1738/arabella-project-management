import React, { useState } from 'react';
import { 
  Plus, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  CloudRain, 
  MoreHorizontal, 
  ChevronRight,
  Filter,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { Task, Discipline } from '../../types';
import { formatDate, triggerCelebration } from '../../utils/formatters';
import { NewTaskModal } from './NewTaskModal';

const COLUMNS: { id: Task['status']; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog / Staged', color: 'border-stone-400' },
  { id: 'todo', title: 'To Do', color: 'border-blue-500' },
  { id: 'in_progress', title: 'In Progress', color: 'border-amber-500' },
  { id: 'review', title: 'Site Inspection / QA', color: 'border-purple-500' },
  { id: 'done', title: 'Completed', color: 'border-emerald-500' },
];

export const KanbanBoardView: React.FC = () => {
  const { 
    tasks, 
    projects, 
    moveTaskStatus, 
    updateTask, 
    selectedProjectId, 
    setSelectedProjectId,
    disciplineFilter 
  } = useProjects();

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [targetColumnStatus, setTargetColumnStatus] = useState<Task['status']>('todo');
  const [filterProject, setFilterProject] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (filterProject !== 'All' && t.projectId !== filterProject) return false;
    if (disciplineFilter !== 'All' && t.discipline !== disciplineFilter) return false;
    if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
    return true;
  });

  const handleMoveStatus = (taskId: string, newStatus: Task['status']) => {
    moveTaskStatus(taskId, newStatus);
    if (newStatus === 'done') {
      triggerCelebration();
    }
  };

  const toggleChecklistItem = (taskId: string, checklistId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.checklist) return;
    const updatedChecklist = task.checklist.map(c =>
      c.id === checklistId ? { ...c, done: !c.done } : c
    );
    updateTask(taskId, { checklist: updatedChecklist });
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      case 'high':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      case 'low':
        return 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-300';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Field & Studio Kanban Board
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Coordinate landscape crews, BDW architectural drawings, civil works, and nursery specimen dispatches.
          </p>
        </div>

        <button
          onClick={() => {
            setTargetColumnStatus('todo');
            setIsNewTaskOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-arabella-900 hover:bg-arabella-800 text-gold-300 text-xs font-semibold border border-gold-500/30 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Work Item</span>
        </button>
      </div>

      {/* Toolbar filters */}
      <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium">Project:</span>
            <select
              value={filterProject}
              onChange={e => setFilterProject(e.target.value)}
              className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1 text-stone-700 dark:text-stone-300"
            >
              <option value="All">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium">Priority:</span>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1 text-stone-700 dark:text-stone-300"
            >
              <option value="All">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="text-stone-400 text-xs">
          Showing <span className="font-bold text-stone-900 dark:text-stone-100">{filteredTasks.length}</span> active tasks
        </div>
      </div>

      {/* Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div
              key={col.id}
              className="bg-stone-100/70 dark:bg-stone-900/50 rounded-2xl p-3 border border-stone-200 dark:border-stone-800/80 flex flex-col min-w-[260px] max-h-[78vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full border-2 ${col.color}`} />
                  <span className="font-serif text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                    {col.title}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono font-bold bg-white dark:bg-stone-800 px-2 py-0.5 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
                    {colTasks.length}
                  </span>
                  <button
                    onClick={() => {
                      setTargetColumnStatus(col.id);
                      setIsNewTaskOpen(true);
                    }}
                    className="p-1 rounded text-stone-400 hover:text-arabella-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Task Cards List */}
              <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
                {colTasks.map(task => {
                  const project = projects.find(p => p.id === task.projectId);
                  return (
                    <div
                      key={task.id}
                      className="group bg-white dark:bg-[#141A16] rounded-xl p-3.5 border border-stone-200 dark:border-stone-800 hover:border-arabella-500/80 transition-all shadow-xs hover:shadow-md space-y-2.5 text-xs"
                    >
                      {/* Top labels */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-bold text-arabella-800 dark:text-arabella-400 truncate max-w-[130px]">
                          {project?.code || 'PROJECT'}
                        </span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                        {task.title}
                      </h4>

                      {/* Description if any */}
                      {task.description && (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Weather alert banner if sensitive */}
                      {task.isWeatherSensitive && (
                        <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-900 text-sky-800 dark:text-sky-300 text-[10px] font-medium">
                          <CloudRain className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                          <span>Weather Sensitive: Requires Dry Window</span>
                        </div>
                      )}

                      {/* Checklist if any */}
                      {task.checklist && task.checklist.length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-stone-100 dark:border-stone-800/80">
                          <div className="flex items-center justify-between text-[10px] text-stone-400">
                            <span>Checklist</span>
                            <span>{task.checklist.filter(c => c.done).length}/{task.checklist.length}</span>
                          </div>
                          {task.checklist.map(c => (
                            <div
                              key={c.id}
                              onClick={() => toggleChecklistItem(task.id, c.id)}
                              className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-300 cursor-pointer hover:text-arabella-600"
                            >
                              <input
                                type="checkbox"
                                readOnly
                                checked={c.done}
                                className="w-3 h-3 text-arabella-600 rounded pointer-events-none"
                              />
                              <span className={c.done ? 'line-through text-stone-400' : ''}>
                                {c.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Card Footer: Assignee, Due Date, Move Selector */}
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
                        <span className="truncate max-w-[100px] text-stone-600 dark:text-stone-300 font-medium">
                          {task.assignedTo.split(' ')[0]}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-stone-400 font-mono">
                          <Calendar className="w-3 h-3" />
                          {formatDate(task.dueDate)}
                        </span>
                      </div>

                      {/* Quick Move Status selector */}
                      <div className="pt-1 flex items-center justify-between gap-1">
                        <select
                          value={task.status}
                          onChange={e => handleMoveStatus(task.id, e.target.value as any)}
                          className="w-full text-[10px] font-medium bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded px-1.5 py-1 text-stone-700 dark:text-stone-300 focus:outline-none"
                        >
                          <option value="backlog">Move to: Backlog</option>
                          <option value="todo">Move to: To Do</option>
                          <option value="in_progress">Move to: In Progress</option>
                          <option value="review">Move to: Review / QA</option>
                          <option value="done">Move to: Done</option>
                        </select>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-stone-400 text-xs italic">
                    No items in this column
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isNewTaskOpen && (
        <NewTaskModal
          defaultStatus={targetColumnStatus}
          onClose={() => setIsNewTaskOpen(false)}
        />
      )}
    </div>
  );
};
