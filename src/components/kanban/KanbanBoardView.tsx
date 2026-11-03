import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  CloudRain, 
  GripVertical,
  CheckSquare,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { Task } from '../../types';
import { formatDate, triggerCelebration } from '../../utils/formatters';
import { NewTaskModal } from './NewTaskModal';

const COLUMNS: { id: Task['status']; title: string; color: string; bgAccent: string }[] = [
  { id: 'backlog', title: 'Backlog / Staged', color: 'border-stone-400', bgAccent: 'group-hover:border-stone-400' },
  { id: 'todo', title: 'To Do', color: 'border-blue-500', bgAccent: 'group-hover:border-blue-500' },
  { id: 'in_progress', title: 'In Progress', color: 'border-amber-500', bgAccent: 'group-hover:border-amber-500' },
  { id: 'review', title: 'Site Inspection / QA', color: 'border-purple-500', bgAccent: 'group-hover:border-purple-500' },
  { id: 'done', title: 'Completed', color: 'border-emerald-500', bgAccent: 'group-hover:border-emerald-500' },
];

export const KanbanBoardView: React.FC = () => {
  const { 
    tasks, 
    projects, 
    moveTaskStatus, 
    updateTask, 
    disciplineFilter 
  } = useProjects();

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [targetColumnStatus, setTargetColumnStatus] = useState<Task['status']>('todo');
  const [filterProject, setFilterProject] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');

  // Drag and Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<Task['status'] | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (filterProject !== 'All' && t.projectId !== filterProject) return false;
    if (disciplineFilter !== 'All' && t.discipline !== disciplineFilter) return false;
    if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
    return true;
  });

  const handleManualMoveStatus = (taskId: string, newStatus: Task['status']) => {
    moveTaskStatus(taskId, newStatus);
    if (newStatus === 'done') {
      triggerCelebration();
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColId(null);
    setDragOverTaskId(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, colId: Task['status']) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleColumnDragLeave = (e: React.DragEvent, colId: Task['status']) => {
    // Only reset if leaving the column boundary completely
    if (e.currentTarget === e.target) {
      if (dragOverColId === colId) {
        setDragOverColId(null);
      }
    }
  };

  const handleTaskDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverTaskId !== taskId) {
      setDragOverTaskId(taskId);
    }
  };

  const handleDrop = (targetColId: Task['status'], targetTaskId?: string) => {
    const taskIdToMove = draggedTaskId;
    if (!taskIdToMove) return;

    const sourceTask = tasks.find(t => t.id === taskIdToMove);
    if (!sourceTask) return;

    // Execute move
    moveTaskStatus(taskIdToMove, targetColId, targetTaskId);

    // If moved to done, celebrate!
    if (targetColId === 'done' && sourceTask.status !== 'done') {
      triggerCelebration();
    }

    setDraggedTaskId(null);
    setDragOverColId(null);
    setDragOverTaskId(null);
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
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-arabella-100 text-arabella-900 dark:bg-arabella-950 dark:text-arabella-300 text-[11px] font-bold mb-1">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Interactive Drag &amp; Drop Workflow</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Field &amp; Studio Kanban Board
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Drag and drop task cards freely between columns to coordinate landscape crews, living walls, and architectural drawings.
          </p>
        </div>

        <button
          onClick={() => {
            setTargetColumnStatus('todo');
            setIsNewTaskOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-arabella-900 hover:bg-arabella-800 text-gold-300 text-xs font-semibold border border-gold-500/30 shadow-xs self-start sm:self-auto transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Work Item</span>
        </button>
      </div>

      {/* Toolbar filters and Drag Instruction */}
      <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium">Project:</span>
            <select
              value={filterProject}
              onChange={e => setFilterProject(e.target.value)}
              className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1 text-stone-700 dark:text-stone-300 cursor-pointer"
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
              className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1 text-stone-700 dark:text-stone-300 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-arabella-800 dark:text-arabella-300 bg-arabella-50 dark:bg-arabella-950/70 border border-arabella-200 dark:border-arabella-800/80 px-2.5 py-1 rounded-lg text-[11px] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-arabella-600" />
            <span>Drag any card or grip handle to reassign stage</span>
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
          const isColumnOver = dragOverColId === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleColumnDragOver(e, col.id)}
              onDragLeave={(e) => handleColumnDragLeave(e, col.id)}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(col.id);
              }}
              className={`rounded-2xl p-3 border transition-all duration-200 flex flex-col min-w-[260px] max-h-[80vh] ${
                isColumnOver
                  ? 'bg-arabella-50/80 dark:bg-arabella-950/60 border-arabella-500 ring-2 ring-arabella-500/30 scale-[1.01] shadow-lg'
                  : 'bg-stone-100/70 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800/80'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full border-2 ${col.color}`} />
                  <span className="font-serif text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                    {col.title}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border text-stone-600 dark:text-stone-300 transition-colors ${
                    isColumnOver 
                      ? 'bg-arabella-600 text-white border-arabella-600' 
                      : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700'
                  }`}>
                    {colTasks.length}
                  </span>
                  <button
                    onClick={() => {
                      setTargetColumnStatus(col.id);
                      setIsNewTaskOpen(true);
                    }}
                    title={`Add task to ${col.title}`}
                    className="p-1 rounded text-stone-400 hover:text-arabella-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Task Cards List */}
              <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1 min-h-[140px]">
                {colTasks.map(task => {
                  const project = projects.find(p => p.id === task.projectId);
                  const isBeingDragged = draggedTaskId === task.id;
                  const isTaskOver = dragOverTaskId === task.id && draggedTaskId !== task.id;

                  return (
                    <div
                      key={task.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleTaskDragOver(e, task.id)}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDrop(col.id, task.id);
                      }}
                      className={`group bg-white dark:bg-[#141A16] rounded-xl p-3.5 border transition-all duration-150 shadow-xs hover:shadow-md space-y-2.5 text-xs cursor-grab active:cursor-grabbing ${
                        isBeingDragged
                          ? 'opacity-30 scale-95 border-dashed border-2 border-arabella-500 ring-2 ring-arabella-400/20'
                          : isTaskOver
                          ? 'border-arabella-500 ring-2 ring-arabella-500/40 translate-y-0.5 shadow-md'
                          : 'border-stone-200 dark:border-stone-800 hover:border-arabella-500/80'
                      }`}
                    >
                      {/* Top labels with Drag Grip Indicator */}
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <GripVertical className="w-3.5 h-3.5 text-stone-300 group-hover:text-arabella-600 dark:text-stone-600 dark:group-hover:text-arabella-400 transition-colors flex-shrink-0" />
                          <span className="text-[10px] font-mono font-bold text-arabella-800 dark:text-arabella-400 truncate max-w-[110px]">
                            {project?.code || 'PROJECT'}
                          </span>
                        </div>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleChecklistItem(task.id, c.id);
                              }}
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

                      {/* Card Footer: Assignee & Due Date */}
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
                        <span className="truncate max-w-[100px] text-stone-600 dark:text-stone-300 font-medium">
                          {task.assignedTo.split(' ')[0]}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-stone-400 font-mono">
                          <Calendar className="w-3 h-3" />
                          {formatDate(task.dueDate)}
                        </span>
                      </div>

                      {/* Accessible Manual Selector Fallback */}
                      <div className="pt-1 flex items-center justify-between gap-1">
                        <select
                          value={task.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={e => handleManualMoveStatus(task.id, e.target.value as any)}
                          className="w-full text-[10px] font-medium bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded px-1.5 py-1 text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
                        >
                          <option value="backlog">Stage: Backlog</option>
                          <option value="todo">Stage: To Do</option>
                          <option value="in_progress">Stage: In Progress</option>
                          <option value="review">Stage: Inspection</option>
                          <option value="done">Stage: Completed</option>
                        </select>
                      </div>
                    </div>
                  );
                })}

                {/* Empty State / Drag Drop Target Placeholder */}
                {colTasks.length === 0 && (
                  <div className={`text-center py-10 px-2 rounded-xl border border-dashed transition-colors text-xs ${
                    isColumnOver 
                      ? 'border-arabella-500 bg-arabella-100/50 dark:bg-arabella-900/30 text-arabella-900 dark:text-arabella-200 font-semibold'
                      : 'border-stone-300 dark:border-stone-800 text-stone-400 italic'
                  }`}>
                    {isColumnOver ? `Drop to move to ${col.title}` : 'No active items in this column'}
                  </div>
                )}

                {/* Active Dropzone Target at the bottom when dragging */}
                {draggedTaskId && colTasks.length > 0 && (
                  <div
                    onDragOver={(e) => handleColumnDragOver(e, col.id)}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDrop(col.id);
                    }}
                    className={`py-3 px-2 rounded-xl border-2 border-dashed text-center text-[11px] font-semibold transition-all ${
                      isColumnOver
                        ? 'border-arabella-500 bg-arabella-100/70 dark:bg-arabella-900/40 text-arabella-800 dark:text-arabella-300 scale-[1.02]'
                        : 'border-stone-300 dark:border-stone-700 text-stone-400 bg-stone-50/50 dark:bg-stone-800/20'
                    }`}
                  >
                    Drop to place at end of {col.title}
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
