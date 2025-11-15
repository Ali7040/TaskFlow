'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Folder, Users, Calendar, ChevronRight, Plus, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ProjectForm from './ProjectForm';
import { format } from 'date-fns';
import { UserButton, useUser } from '@clerk/nextjs';

interface Project {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: any[];
  createdAt: string;
  updatedAt: string;
}

export default function ProjectList() {
  const router = useRouter();
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        // If response is not ok, still try to parse and show empty state
        // Only show error for critical failures (401, 500 with specific error message)
        if (response.status === 401) {
          toast.error('Please sign in to view projects');
          return;
        }
        
        // For other errors, try to get data anyway or use empty array
        try {
          const errorData = await response.json();
          if (errorData.projects) {
            setProjects(errorData.projects);
          } else {
            setProjects([]);
          }
        } catch {
          setProjects([]);
        }
        return;
      }

      const data = await response.json();
      // Always set projects, even if empty array (which is normal for new users)
      setProjects(data.projects || []);
    } catch (error: any) {
      // Network errors or other issues - show empty state instead of error
      console.error('Error fetching projects:', error);
      setProjects([]);
      // Only show error toast for network errors, not for empty results
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleExportProjects = () => {
    if (projects.length === 0) {
      toast.error('No projects to export');
      return;
    }

    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-projects-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Projects exported successfully');
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string, projectName: string) => {
    e.stopPropagation(); // Prevent navigation to project page
    
    toast('Are you sure you want to delete this project?', {
      description: `This will permanently delete "${projectName}" and all its tasks. This action cannot be undone.`,
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const response = await fetch(`/api/projects/${projectId}`, {
              method: 'DELETE',
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Failed to delete project');
            }

            setProjects(prev => prev.filter(p => p._id !== projectId));
            toast.success('Project deleted successfully');
          } catch (err: any) {
            toast.error(err.message || 'Error deleting project');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
      duration: 10000,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
          <p className="text-sm text-gray-600">Project Management</p>
        </div>
        <div className="flex items-center gap-3">
          {projects.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportProjects}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Projects
            </Button>
          )}
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h2>
          <p className="text-gray-600">Manage your project workflows and team collaboration</p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Folder className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Create your first project to get started</p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => {
              const isOwner = user?.id === project.ownerId;
              return (
                <div
                  key={project._id}
                  onClick={() => handleProjectClick(project._id)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-200 hover:border-blue-300 group relative"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Folder className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        {isOwner && (
                          <button
                            onClick={(e) => handleDeleteProject(e, project._id, project.name)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                      {project.name}
                    </h3>
                    
                    {project.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{project.members.length} member{project.members.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(project.updatedAt), 'MMM dd')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateForm && (
        <ProjectForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={fetchProjects}
        />
      )}
    </div>
  );
}
