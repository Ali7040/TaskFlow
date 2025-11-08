'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { X, Calendar as CalendarIcon, FileText, Tag, Sparkles } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskFormProps {
  task?: Task;
  allTasks: Task[];
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export default function TaskForm({ task, allTasks, onSave, onClose }: TaskFormProps) {
  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    startDate: task?.startDate || new Date().toISOString().split('T')[0],
    endDate: task?.endDate || new Date().toISOString().split('T')[0],
    dependencies: task?.dependencies || [],
    status: task?.status || 'not-started' as const,
  });

  const [startDate, setStartDate] = useState<Date | undefined>(
    task?.startDate ? new Date(task.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    task?.endDate ? new Date(task.endDate) : new Date()
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Available tasks for dependencies (exclude current task if editing)
  const availableTasks = allTasks.filter(t => t.id !== task?.id);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update formData with selected dates
    const updatedFormData = {
      ...formData,
      startDate: startDate ? startDate.toISOString().split('T')[0] : formData.startDate,
      endDate: endDate ? endDate.toISOString().split('T')[0] : formData.endDate,
    };
    if (validate()) {
      onSave(updatedFormData);
      toast.success(task ? 'Task updated!' : 'Task created!');
      onClose();
    } else {
      toast.error('Please fix the errors in the form.');
    }
  };

  const toggleDependency = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.includes(taskId)
        ? prev.dependencies.filter(id => id !== taskId)
        : [...prev.dependencies, taskId],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Task Name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Tag className="w-4 h-4 text-blue-600" />
                Task Name *
              </Label>
              <Input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                placeholder="Enter task name..."
              />
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="text-red-500">⚠</span> {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="w-4 h-4 text-blue-600" />
                Description
              </Label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="resize-none"
                placeholder="Add task description..."
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  Start Date *
                </Label>
                <DatePicker
                  date={startDate}
                  onDateChange={(date) => {
                    setStartDate(date);
                    if (date) {
                      setFormData({ ...formData, startDate: date.toISOString().split('T')[0] });
                    }
                  }}
                  placeholder="Pick start date"
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span> {errors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  End Date *
                </Label>
                <DatePicker
                  date={endDate}
                  onDateChange={(date) => {
                    setEndDate(date);
                    if (date) {
                      setFormData({ ...formData, endDate: date.toISOString().split('T')[0] });
                    }
                  }}
                  placeholder="Pick end date"
                />
                {errors.endDate && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span> {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Status
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'not-started', label: 'Not Started', icon: '○', color: 'gray' },
                  { value: 'in-progress', label: 'In Progress', icon: '◐', color: 'blue' },
                  { value: 'completed', label: 'Completed', icon: '●', color: 'green' },
                ].map(status => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: status.value as any })}
                    className={`relative px-3 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200 ${
                      formData.status === status.value
                        ? status.color === 'gray'
                          ? 'border-gray-400 bg-gray-50 text-gray-700 shadow-md'
                          : status.color === 'blue'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                          : 'border-green-500 bg-green-50 text-green-700 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg mb-1 block">{status.icon}</span>
                    <span className="text-xs">{status.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dependencies */}
            {availableTasks.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-semibold block">
                  Dependencies
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    (This task depends on)
                  </span>
                </Label>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-muted/30">
                  {availableTasks.map(t => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-background cursor-pointer transition-colors border border-transparent hover:border-border"
                    >
                      <Checkbox
                        id={t.id}
                        checked={formData.dependencies.includes(t.id)}
                        onCheckedChange={() => toggleDependency(t.id)}
                      />
                      <label
                        htmlFor={t.id}
                        className="text-sm flex-1 cursor-pointer"
                      >
                        {t.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </div>
    </div>
  );
}
