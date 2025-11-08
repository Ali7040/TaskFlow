'use client';

import React from 'react';
import { Task } from '../types';
import { Plus, List, Calendar, TrendingUp, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface SidebarProps {
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ tasks, onAddTask, onEditTask, onClearAll, isOpen }: SidebarProps) {
  const stats = {
    total: tasks.length,
    notStarted: tasks.filter(t => t.status === 'not-started').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-2xl z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ width: '380px' }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 bg-white/20 text-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">TaskFlow</h2>
            </div>
            <p className="text-gray-500 text-sm">Manage your project tasks</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-linear-to-br from-gray-50 to-blue-50">
          <div className="bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              <div className="text-xs font-medium text-gray-500">Total</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div className="text-xs font-medium text-gray-500">Done</div>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <div className="text-xs font-medium text-gray-500">Active</div>
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
              <div className="text-xs font-medium text-gray-500">Pending</div>
            </div>
            <div className="text-2xl font-bold text-gray-500">{stats.notStarted}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onAddTask}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] transform duration-200 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="relative z-10">Add New Task</span>
          </button>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center gap-2 mb-3">
            <List className="w-4 h-4 text-gray-500" />
            <h3 className="font-semibold text-gray-900 text-sm">All Tasks</h3>
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No tasks yet</p>
              <p className="text-gray-400 text-xs mt-1">Create your first task to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map(task => {
                const statusColors = {
                  'not-started': 'bg-gray-100 border-gray-200',
                  'in-progress': 'bg-blue-50 border-blue-200',
                  'completed': 'bg-green-50 border-green-200',
                };

                return (
                  <div
                    key={task.id}
                    onClick={() => onEditTask(task)}
                    className={`p-3 rounded-lg border-l-4 ${statusColors[task.status]} cursor-pointer hover:shadow-md transition-all`}
                  >
                    <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-1">
                      {task.name}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(task.startDate), 'MMM dd')}</span>
                      <span>→</span>
                      <span>{format(new Date(task.endDate), 'MMM dd')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {tasks.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClearAll}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Tasks
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
