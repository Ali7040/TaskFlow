'use client';

import React from 'react';
import { Task } from '../types';
import { Plus, TrendingUp, ChevronRight, X } from 'lucide-react';

interface SidebarProps {
  tasks: Task[];
  onAddTask: () => void;
  onEditTask?: (task: Task) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ tasks, onAddTask, onEditTask, onClearAll, isOpen, onToggle }: SidebarProps) {
  const stats = {
    total: tasks.length,
    notStarted: tasks.filter(t => t.status === 'not-started').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const sidebarWidth = '380px';


  return (
    <>
      {/* Floating open button when sidebar is closed */}
      {/* {!isOpen && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="fixed left-4 top-24 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center w-12 h-12 cursor-pointer"
          title="Open sidebar"
          aria-label="Open sidebar"
          style={{ zIndex: 100, position: 'fixed' }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )} */}

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      {isOpen && (
        <div
          className="bg-white shadow-xl border-r border-gray-200 flex flex-col shrink-0 relative overflow-hidden"
          style={{ 
            width: sidebarWidth,
            minWidth: sidebarWidth,
            maxWidth: sidebarWidth,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 truncate">TaskFlow</h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onToggle}
                className="p-2 hover:bg-white rounded-md transition-colors border border-transparent hover:border-gray-300"
                title="Close sidebar"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Quick actions & stats</p>
        </div>

        {/* Stats */}
        <div className="shrink-0 grid grid-cols-2 gap-3 p-4 bg-gray-50">
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
        <div className="shrink-0 p-4 border-t border-gray-200">
          <button
            onClick={onAddTask}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] transform duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Task</span>
          </button>
          
          {tasks.length > 0 && (
            <button
              onClick={onClearAll}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors border border-red-200"
            >
              Clear All Tasks
            </button>
          )}
        </div>
        </div>
      )}
    </>
  );
}
