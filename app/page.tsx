'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
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

import { Task } from './types';
import { storageTasks } from './utils/storage';
import { calculateNodePositions } from './utils/layout';
import TaskNode from './components/TaskNode';
import TaskForm from './components/TaskForm';
import Sidebar from './components/Sidebar';
import QuickStartGuide from './components/QuickStartGuide';
import { Menu, X, Download, Upload, Maximize2, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const nodeTypes = {
  taskNode: TaskNode,
};

export default function Home() {
  const { user, isLoaded } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag to prevent hydration errors
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load tasks from localStorage on mount (client-side only)
  useEffect(() => {
    if (!isClient || !isLoaded || !user) return;
    
    const loadedTasks = storageTasks.getAll();
    setTasks(loadedTasks);
    
    // Show guide for first-time users
    const hasSeenGuide = localStorage.getItem('taskflow_seen_guide');
    if (!hasSeenGuide && loadedTasks.length === 0) {
      setShowGuide(true);
      localStorage.setItem('taskflow_seen_guide', 'true');
    }
  }, [isClient, isLoaded, user]);

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

  const handleAddTask = useCallback(() => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  }, []);

  const handleSaveTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isClient) return;
    try {
      if (editingTask) {
        const updatedTasks = storageTasks.update(editingTask.id, taskData);
        setTasks(updatedTasks);
        toast.success('Task updated successfully!');
      } else {
        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedTasks = storageTasks.add(newTask);
        setTasks(updatedTasks);
        toast.success('Task created successfully!');
      }
      setIsFormOpen(false);
      setEditingTask(undefined);
    } catch (err) {
      toast.error('Error saving task.');
    }
  }, [editingTask, isClient]);

  const handleDeleteTask = useCallback((id: string) => {
    toast('Are you sure you want to delete this task?', {
      action: {
        label: 'Delete',
        onClick: () => {
          const updatedTasks = storageTasks.delete(id);
          setTasks(updatedTasks);
          toast.success('Task deleted.');
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
      duration: 5000,
      style: { background: '#fff', color: '#222' },
    });
  }, []);

  const handleClearAll = useCallback(() => {
    toast('Delete all tasks? This action cannot be undone.', {
      action: {
        label: 'Delete All',
        onClick: () => {
          storageTasks.clear();
          setTasks([]);
          toast.success('All tasks deleted.');
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
      duration: 5000,
      style: { background: '#fff', color: '#222' },
    });
  }, []);

  const handleConnect = useCallback(
    (connection: Connection) => {
      // Update task dependencies when connecting nodes
      if (connection.source && connection.target) {
        const updatedTasks = storageTasks.update(connection.target, {
          dependencies: [
            ...tasks.find(t => t.id === connection.target)?.dependencies || [],
            connection.source,
          ],
        });
        setTasks(updatedTasks);
      }
    },
    [tasks]
  );

  const handleExportData = useCallback(() => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [tasks]);

  const handleImportData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTasks = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedTasks)) {
            storageTasks.save(importedTasks);
            setTasks(importedTasks);
            toast.success('Tasks imported successfully!');
          }
        } catch (error) {
          toast.error('Error importing file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Show loading state while checking authentication
  if (!isClient || !isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-600">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        tasks={tasks}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onClearAll={handleClearAll}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div
        className={`h-full transition-all duration-300 ${
          isSidebarOpen ? 'ml-[380px]' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className="h-16  border-b border-gray-200 flex items-center justify-between px-6 shadow-md z-30 relative backdrop-blur-lg bg-white/95">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-200 group"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              )}
            </button>
            <div className="flex items-center gap-3">
              
              <div>
                <h1 className="text-xl font-bold bg--blue-600">TaskFlow</h1>
                <p className="text-xs text-gray-500">Project Network Diagram</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              disabled={tasks.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Download className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
              <span className="group-hover:text-blue-600 transition-colors">Export</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:from-green-50 hover:to-emerald-50 rounded-lg transition-all cursor-pointer group">
              <Upload className="w-4 h-4 group-hover:text-green-600 transition-colors" />
              <span className="group-hover:text-green-600 transition-colors">Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>

            <button
              onClick={toggleFullscreen}
              className="p-2 hover:from-purple-50 hover:to-pink-50 rounded-lg transition-all group"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
            </button>

            <button
              onClick={() => setShowGuide(true)}
              className="p-2 hover:from-amber-50 hover:to-yellow-50 rounded-lg transition-all group"
              title="Quick Start Guide"
            >
              <HelpCircle className="w-4 h-4 text-gray-600 group-hover:text-amber-600 transition-colors" />
            </button>

            {isLoaded && (
              <div className="ml-2 flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{user?.firstName || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10 ring-2 ring-blue-500 ring-offset-2',
                    }
                  }}
                />
              </div>
            )}
          </div>
        </header>

        {/* ReactFlow Canvas */}
        <div className="h-[calc(100%-4rem)]">
          {tasks.length === 0 ? (
            <div className="h-full flex items-center justify-center from-blue-50 via-white to-indigo-50">
              <div className="text-center animate-fade-in">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-16 h-16 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  Welcome to TaskFlow
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Start by creating your first task. Build an interactive network diagram to visualize task
                  dependencies and manage your project effectively.
                </p>
                <button
                  onClick={handleAddTask}
                  className="group px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 duration-200 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First Task
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={handleConnect}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
            >
              <Background color="#e5e7eb" gap={16} />
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  const task = tasks.find(t => t.id === node.id);
                  if (!task) return '#9ca3af';
                  return task.status === 'completed'
                    ? '#10b981'
                    : task.status === 'in-progress'
                    ? '#3b82f6'
                    : '#9ca3af';
                }}
                maskColor="rgba(0, 0, 0, 0.1)"
              />
            </ReactFlow>
          )}
        </div>
      </div>

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

      {/* Quick Start Guide */}
      {showGuide && (
        <QuickStartGuide onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
}
