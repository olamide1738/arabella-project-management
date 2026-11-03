import React, { useState } from 'react';
import { useProjects } from './context/ProjectContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProjectsListView } from './components/projects/ProjectsListView';
import { KanbanBoardView } from './components/kanban/KanbanBoardView';
import { GanttTimelineView } from './components/timeline/GanttTimelineView';
import { NigeriaProjectMapView } from './components/map/NigeriaProjectMapView';
import { NurseryInventoryView } from './components/nursery/NurseryInventoryView';
import { StatutoryPermitsView } from './components/permits/StatutoryPermitsView';
import { SiteLogsView } from './components/sitelogs/SiteLogsView';
import { SnaggingView } from './components/snagging/SnaggingView';
import { BOQView } from './components/boq/BOQView';
import { ClientPortalView } from './components/client/ClientPortalView';
import { NewProjectModal } from './components/projects/NewProjectModal';
import { NewTaskModal } from './components/kanban/NewTaskModal';

export const AppContent: React.FC = () => {
  const { activeTab } = useProjects();
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'projects':
        return <ProjectsListView onOpenNewTask={() => setIsNewTaskOpen(true)} />;
      case 'kanban':
        return <KanbanBoardView />;
      case 'timeline':
        return <GanttTimelineView />;
      case 'map':
        return <NigeriaProjectMapView />;
      case 'nursery':
        return <NurseryInventoryView />;
      case 'permits':
        return <StatutoryPermitsView />;
      case 'sitelogs':
        return <SiteLogsView />;
      case 'snagging':
        return <SnaggingView />;
      case 'boq':
        return <BOQView />;
      case 'client-portal':
        return <ClientPortalView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#080B09] text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      <Navbar
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        onOpenNewTask={() => setIsNewTaskOpen(true)}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-53px)] custom-scrollbar">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      {isNewProjectOpen && (
        <NewProjectModal onClose={() => setIsNewProjectOpen(false)} />
      )}

      {isNewTaskOpen && (
        <NewTaskModal onClose={() => setIsNewTaskOpen(false)} />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
