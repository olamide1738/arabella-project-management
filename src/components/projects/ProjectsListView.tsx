import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  LayoutGrid, 
  List, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { Project, Discipline, ProjectCategory, ProjectStage } from '../../types';
import { 
  formatCurrency, 
  formatDate, 
  getDisciplineBadgeClass, 
  getHealthBadgeClass,
  getStageProgressColor 
} from '../../utils/formatters';
import { ProjectDetailModal } from './ProjectDetailModal';
import { NewProjectModal } from './NewProjectModal';

export const ProjectsListView: React.FC<{ onOpenNewTask: () => void }> = ({ onOpenNewTask }) => {
  const { 
    projects, 
    deleteProject, 
    disciplineFilter, 
    setDisciplineFilter,
    cityFilter, 
    setCityFilter,
    searchQuery, 
    setSearchQuery 
  } = useProjects();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedDetailProject, setSelectedDetailProject] = useState<Project | null>(null);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'All' | ProjectCategory>('All');

  // Filter projects
  const filtered = projects.filter(p => {
    if (disciplineFilter !== 'All' && p.discipline !== disciplineFilter) return false;
    if (cityFilter !== 'All' && p.location.city !== cityFilter) return false;
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchClient = p.client.name.toLowerCase().includes(q) || p.client.organization.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchLoc = p.location.neighborhood.toLowerCase().includes(q) || p.location.city.toLowerCase().includes(q);
      if (!matchName && !matchClient && !matchCode && !matchLoc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Commissions & Works Directory
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Portfolio of landscape architecture, living bio-facades, and BDW architectural residences across Nigeria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-lg border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-stone-900 text-arabella-900 dark:text-arabella-300 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-stone-900 text-arabella-900 dark:text-arabella-300 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* New Project Button */}
          <button
            onClick={() => setIsNewProjectOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-arabella-900 hover:bg-arabella-800 text-gold-300 text-xs font-semibold border border-gold-500/30 shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Commission</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-stone-900 rounded-xl p-3 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
          >
            <option value="All">All Categories</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
            <option value="Civic & Public Space">Civic & Public Space</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Mixed-Use">Mixed-Use</option>
            <option value="Masterplan">Masterplan</option>
          </select>

          {/* Discipline Filter */}
          <div className="hidden md:flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
            {(['All', 'Landscape', 'Architecture', 'Integrated Design-Build'] as ('All' | Discipline)[]).map(d => (
              <button
                key={d}
                onClick={() => setDisciplineFilter(d)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  disciplineFilter === d
                    ? 'bg-white dark:bg-stone-900 text-arabella-900 dark:text-arabella-300 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                {d === 'Integrated Design-Build' ? 'Integrated' : d}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-stone-500 dark:text-stone-400">
          Showing <span className="font-bold text-stone-900 dark:text-stone-100">{filtered.length}</span> of {projects.length} commissions
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(project => (
            <div
              key={project.id}
              onClick={() => setSelectedDetailProject(project)}
              className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-arabella-600 dark:hover:border-arabella-500 transition-all shadow-xs hover:shadow-lg cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-44 w-full overflow-hidden bg-stone-900">
                  <img
                    src={project.coverImage}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  
                  {/* Badges on cover */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getDisciplineBadgeClass(project.discipline)}`}>
                      {project.discipline}
                    </span>
                    <span className="text-[10px] font-mono bg-black/60 text-white backdrop-blur-xs px-2 py-0.5 rounded-md">
                      {project.code}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getHealthBadgeClass(project.health)}`}>
                      {project.health}
                    </span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold-300 transition-colors truncate">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-stone-200 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-arabella-400 flex-shrink-0" />
                      <span className="truncate">{project.location.neighborhood}, {project.location.city}</span>
                      <span>&bull;</span>
                      <span className="truncate">{project.siteArea}</span>
                    </div>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400">Current Phase:</span>
                    <span className="font-semibold text-arabella-900 dark:text-arabella-300 truncate max-w-[190px]">
                      {project.currentStage}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-500 dark:text-stone-400">Progress</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {project.timeline.progressPercentage}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-arabella-600 rounded-full transition-all"
                        style={{ width: `${project.timeline.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Client & Contract */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase">Contract Value</div>
                      <div className="font-bold text-stone-900 dark:text-stone-100">
                        {formatCurrency(project.budget.contractValue)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-stone-400 uppercase">Client</div>
                      <div className="font-medium text-stone-700 dark:text-stone-300 truncate max-w-[140px]">
                        {project.client.organization || project.client.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500">
                <span className="truncate">Lead: {project.team.leadArchitect}</span>
                <span className="text-arabella-600 dark:text-arabella-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  View <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 uppercase text-[10px] font-bold tracking-wider text-stone-500">
                <tr>
                  <th className="py-3 px-4">Code / Commission</th>
                  <th className="py-3 px-4">Discipline</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Current Phase</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Contract Value</th>
                  <th className="py-3 px-4">Health</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filtered.map(project => (
                  <tr
                    key={project.id}
                    onClick={() => setSelectedDetailProject(project)}
                    className="hover:bg-stone-50/80 dark:hover:bg-stone-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">
                      <div className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                        {project.name}
                      </div>
                      <div className="text-[11px] font-mono text-stone-400">
                        {project.code} &bull; {project.client.organization}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getDisciplineBadgeClass(project.discipline)}`}>
                        {project.discipline}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400">
                      {project.location.neighborhood}, {project.location.city}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-800 dark:text-stone-200">
                      {project.currentStage}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-arabella-600 rounded-full"
                            style={{ width: `${project.timeline.progressPercentage}%` }}
                          />
                        </div>
                        <span className="font-bold text-[11px]">{project.timeline.progressPercentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900 dark:text-stone-100">
                      {formatCurrency(project.budget.contractValue)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getHealthBadgeClass(project.health)}`}>
                        {project.health}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete project "${project.name}"?`)) {
                            deleteProject(project.id);
                          }
                        }}
                        className="p-1 rounded text-stone-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedDetailProject && (
        <ProjectDetailModal
          project={selectedDetailProject}
          onClose={() => setSelectedDetailProject(null)}
          onOpenNewTask={onOpenNewTask}
        />
      )}

      {isNewProjectOpen && (
        <NewProjectModal onClose={() => setIsNewProjectOpen(false)} />
      )}
    </div>
  );
};
