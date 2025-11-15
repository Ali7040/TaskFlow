'use client';

import React, { useState } from 'react';
import { X, Plus, Folder, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ProjectFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProjectForm({ onClose, onSuccess }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create project');
      }

      toast.success('Project created successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Error creating project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Folder className="w-4 h-4 text-blue-600" />
                Project Name *
              </Label>
              <Input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name..."
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Users className="w-4 h-4 text-blue-600" />
                Description
              </Label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="resize-none"
                placeholder="Add project description..."
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
