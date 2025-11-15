'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Task } from '@/app/types';
import { calculateNodePositions } from '@/app/utils/layout';
import TaskNode from '@/app/components/TaskNode';
import TaskForm from '@/app/components/TaskForm';
import Sidebar from '@/app/components/Sidebar';
import TaskDetailsPanel from '@/app/components/TaskDetailsPanel';
import Guide from '@/app/components/Guide';
import { Menu, X, Download, Upload, ArrowLeft, Settings, UserPlus, Edit2, Check, X as XIcon, PanelLeftClose, PanelRightClose, Table, ChevronLeft, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const nodeTypes = {
  taskNode: TaskNode,
};

interface Project {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: Array<{
    userId: string;
    email: string;
    role: 'owner' | 'manager' | 'viewer';
  }>;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'owner' | 'manager' | 'viewer'>('viewer');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if guide should be shown on first visit
  useEffect(() => {
    if (!isClient || !projectId) return;
    
    const guideKey = `taskflow_guide_seen_${projectId}`;
    const hasSeenGuide = localStorage.getItem(guideKey);
    
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, [isClient, projectId]);

  // Fetch project and tasks
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchData = async () => {
      try {
        // Fetch project
        const projectRes = await fetch(`/api/projects/${projectId}`);
        if (!projectRes.ok) throw new Error('Failed to fetch project');
        const projectData = await projectRes.json();
        setProject(projectData.project);

        // Determine user role
        const member = projectData.project.members.find((m: any) => m.userId === user.id);
        if (member) {
          setUserRole(member.role);
        }

        // Fetch tasks
        const tasksRes = await fetch(`/api/projects/${projectId}/tasks`);
        if (!tasksRes.ok) throw new Error('Failed to fetch tasks');
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks.map((t: any) => ({
          ...t,
          id: t._id,
        })));
      } catch (error: any) {
        toast.error(error.message || 'Error loading project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, user, projectId]);

  // Update nodes and edges when tasks change
  useEffect(() => {
    if (tasks.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const positions = calculateNodePositions(tasks);
    
    const newNodes: Node[] = tasks.map(task => ({
      id: task.id,
      type: 'taskNode',
      position: positions.get(task.id) || { x: 0, y: 0 },
      data: {
        task,
        onEdit: handleEditTask,
        onDelete: handleDeleteTask,
      },
    }));

    const newEdges: Edge[] = [];
    tasks.forEach(task => {
      task.dependencies.forEach(depId => {
        newEdges.push({
          id: `${depId}-${task.id}`,
          source: depId,
          target: task.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#3b82f6',
          },
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [tasks]);

  const canEdit = userRole === 'owner' || userRole === 'manager';

  const handleUpdateProjectName = useCallback(async () => {
    if (!canEdit || !projectNameInput.trim()) {
      setIsEditingProjectName(false);
      setProjectNameInput(project?.name || '');
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectNameInput.trim() }),
      });

      if (!response.ok) throw new Error('Failed to update project name');
      
      const { project: updatedProject } = await response.json();
      setProject(updatedProject);
      setIsEditingProjectName(false);
      toast.success('Project name updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error updating project name');
      setProjectNameInput(project?.name || '');
    }
  }, [canEdit, projectNameInput, projectId, project?.name]);

  // Initialize project name input when project loads
  useEffect(() => {
    if (project?.name && !isEditingProjectName) {
      setProjectNameInput(project.name);
    }
  }, [project?.name, isEditingProjectName]);

  const handleAddTask = useCallback(() => {
    if (!canEdit) {
      toast.error('You don\'t have permission to add tasks');
      return;
    }
    setEditingTask(undefined);
    setIsFormOpen(true);
  }, [canEdit]);

  const handleEditTask = useCallback((task: Task) => {
    if (!canEdit) {
      toast.error('You don\'t have permission to edit tasks');
      return;
    }
    setEditingTask(task);
    setIsFormOpen(true);
  }, [canEdit]);

  const handleSaveTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isClient || !canEdit) return;
    
    try {
      if (editingTask) {
        const response = await fetch(`/api/projects/${projectId}/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) throw new Error('Failed to update task');
        
        const { task } = await response.json();
        setTasks(prev => prev.map(t => t.id === task._id ? { ...task, id: task._id } : t));
        toast.success('Task updated successfully!');
      } else {
        const response = await fetch(`/api/projects/${projectId}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) throw new Error('Failed to create task');
        
        const { task } = await response.json();
        setTasks(prev => [...prev, { ...task, id: task._id }]);
        toast.success('Task created successfully!');
      }
      setIsFormOpen(false);
      setEditingTask(undefined);
    } catch (err: any) {
      toast.error(err.message || 'Error saving task');
    }
  }, [editingTask, isClient, canEdit, projectId]);

  const handleDeleteTask = useCallback(async (id: string) => {
    if (!canEdit) {
      toast.error('You don\'t have permission to delete tasks');
      return;
    }

    toast('Are you sure you want to delete this task?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const response = await fetch(`/api/projects/${projectId}/tasks/${id}`, {
              method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete task');

            setTasks(prev => prev.filter(t => t.id !== id));
            toast.success('Task deleted.');
          } catch (err: any) {
            toast.error(err.message || 'Error deleting task');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
      duration: 5000,
    });
  }, [canEdit, projectId]);

  const handleClearAll = useCallback(() => {
    if (!canEdit) {
      toast.error('You don\'t have permission to delete tasks');
      return;
    }

    toast('Delete all tasks? This action cannot be undone.', {
      action: {
        label: 'Delete All',
        onClick: async () => {
          try {
            await Promise.all(tasks.map(t => 
              fetch(`/api/projects/${projectId}/tasks/${t.id}`, { method: 'DELETE' })
            ));
            setTasks([]);
            toast.success('All tasks deleted.');
          } catch (err: any) {
            toast.error(err.message || 'Error deleting tasks');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
      duration: 5000,
    });
  }, [canEdit, projectId, tasks]);

  const handleExportData = useCallback(() => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project?.name || 'project'}-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [tasks, project]);

  const handleExportCSV = useCallback(() => {
    if (tasks.length === 0) {
      toast.error('No tasks to export');
      return;
    }

    const headers = ['Name', 'Description', 'Status', 'Start Date', 'End Date', 'Dependencies'];
    const rows = tasks.map(task => [
      task.name,
      task.description || '',
      task.status,
      new Date(task.startDate).toLocaleDateString(),
      new Date(task.endDate).toLocaleDateString(),
      task.dependencies.join('; ')
    ]);

    const csv = [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project?.name || 'project'}-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Tasks exported as CSV');
  }, [tasks, project]);

  const handleCloseGuide = useCallback(() => {
    if (projectId) {
      const guideKey = `taskflow_guide_seen_${projectId}`;
      localStorage.setItem(guideKey, 'true');
    }
    setShowGuide(false);
  }, [projectId]);

  const handleImportFile = useCallback(async (file: File | null) => {
    if (!file) return;
    if (!canEdit) {
      toast.error('You do not have permission to import tasks');
      return;
    }

    try {
      const text = await file.text();
      let imported: any[] = [];

      if (file.name.endsWith('.json')) {
        imported = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        const lines = text.split(/\r?\n/).filter(Boolean);
        const header = lines.shift()?.split(',').map(h => h.replace(/"/g, '').trim()) || [];
        imported = lines.map(line => {
          const cols = line.split(',').map(c => c.replace(/"/g, '').trim());
          const obj: any = {};
          header.forEach((h, i) => obj[h] = cols[i]);
          return obj;
        });
      } else {
        toast.error('Unsupported file type. Use .json or .csv');
        return;
      }

      // Normalize and POST each task
      const createdTasks: any[] = [];
      for (const item of imported) {
        const payload: any = {
          name: item.name || item.Name || 'Imported Task',
          description: item.description || item.Description || '',
          startDate: item.startDate || item['Start Date'] || new Date().toISOString(),
          endDate: item.endDate || item['End Date'] || new Date().toISOString(),
          status: item.status || item.Status || 'not-started',
          dependencies: item.dependencies ? (Array.isArray(item.dependencies) ? item.dependencies : String(item.dependencies).split(/[;|,]/).map(s => s.trim())) : [],
        };

        const res = await fetch(`/api/projects/${projectId}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const { task } = await res.json();
          createdTasks.push({ ...task, id: task._id });
        }
      }

      if (createdTasks.length > 0) {
        setTasks(prev => [...prev, ...createdTasks]);
        toast.success(`Imported ${createdTasks.length} tasks`);
      } else {
        toast.error('No tasks were imported');
      }
    } catch (err: any) {
      toast.error(err.message || 'Import failed');
    }
  }, [canEdit, projectId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
          <Button onClick={() => router.push('/')}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-50 relative">
        <div className="flex items-center gap-4">
          {/* Left Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
          
          <div className="flex items-center gap-2">
            {isEditingProjectName && canEdit ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={projectNameInput}
                  onChange={(e) => setProjectNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdateProjectName();
                    } else if (e.key === 'Escape') {
                      setIsEditingProjectName(false);
                      setProjectNameInput(project?.name || '');
                    }
                  }}
                  className="text-xl font-bold text-gray-900 border-2 border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleUpdateProjectName}
                  className="p-1 hover:bg-green-100 rounded transition-colors"
                  title="Save"
                >
                  <Check className="w-4 h-4 text-green-600" />
                </button>
                <button
                  onClick={() => {
                    setIsEditingProjectName(false);
                    setProjectNameInput(project?.name || '');
                  }}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                  title="Cancel"
                >
                  <XIcon className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-gray-900">{project?.name}</h1>
                {canEdit && (
                  <button
                    onClick={() => {
                      setIsEditingProjectName(true);
                      setProjectNameInput(project?.name || '');
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Edit project name"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </>
            )}
          </div>
          {project?.description && !isEditingProjectName && (
            <p className="text-sm text-gray-600">{project.description}</p>
          )}
          <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            {userRole}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGuide(true)}
            title="View guide"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Guide
          </Button>
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Invite feature coming soon!')}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
          )}

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              title="Export options"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
            {showExportMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      handleExportData();
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium">Export as JSON</div>
                      <div className="text-xs text-gray-500">Full task data</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      handleExportCSV();
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium">Export as CSV</div>
                      <div className="text-xs text-gray-500">Spreadsheet format</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Import Button + hidden input */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,text/csv"
              className="hidden"
              onChange={e => {
                const f = e.target.files ? e.target.files[0] : null;
                handleImportFile(f);
                e.currentTarget.value = '';
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              title="Import tasks"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Import</span>
            </button>
          </div>

          {/* Right Panel Toggle - Enhanced Button */}
          <button
            onClick={() => setIsDetailsPanelOpen(!isDetailsPanelOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isDetailsPanelOpen
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
            title={isDetailsPanelOpen ? 'Close task details' : 'Open task details'}
            aria-label={isDetailsPanelOpen ? 'Close task details' : 'Open task details'}
          >
            <Table className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">
              {isDetailsPanelOpen ? 'Task Details' : 'Task Details'}
            </span>
            {isDetailsPanelOpen ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </header>

      {/* Main Content - Flex container for sidebar, canvas, and details panel */}
      <div className="flex-1 flex overflow-hidden relative" style={{ height: 'calc(100vh - 73px)' }}>
        {/* Left Sidebar */}
        <Sidebar
          tasks={tasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onClearAll={handleClearAll}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Canvas Area */}
        <div className="flex-1 overflow-hidden relative">
          {tasks.length === 0 ? (
            <div className="h-full flex items-center justify-center bg-white">
              <div className="text-center max-w-md px-4">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-600 mb-6">
                  {canEdit 
                    ? 'Create your first task to start building your project workflow'
                    : 'No tasks have been added to this project yet'}
                </p>
                {canEdit && (
                  <Button
                    onClick={handleAddTask}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Create Your First Task
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gray-50"
            >
              <Background color="#e5e7eb" gap={16} />
              <Controls 
                position="bottom-left"
                className="m-4"
                style={{ left: '1rem', bottom: '1rem' }}
              />
              <MiniMap
                nodeColor="#3b82f6"
                maskColor="rgba(0, 0, 0, 0.1)"
                position="bottom-right"
                className="bg-white border border-gray-200 rounded-lg shadow-lg"
                style={{ right: '1rem', bottom: '1rem' }}
              />
            </ReactFlow>
          )}

          {/* Task Form Modal */}
          {isFormOpen && (
            <TaskForm
              task={editingTask}
              allTasks={tasks}
              onSave={handleSaveTask}
              onClose={() => {
                setIsFormOpen(false);
                setEditingTask(undefined);
              }}
            />
          )}
        </div>

        {/* Right Task Details Panel */}
        <TaskDetailsPanel
          tasks={tasks}
          onEditTask={handleEditTask}
          isOpen={isDetailsPanelOpen}
          onToggle={() => setIsDetailsPanelOpen(!isDetailsPanelOpen)}
        />
      </div>

      {/* Guide Modal */}
      {showGuide && <Guide onClose={handleCloseGuide} />}
    </div>
  );
}
