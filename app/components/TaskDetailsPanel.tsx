'use client';

import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import { X, ChevronLeft, Table, User, Calendar, CheckCircle2, Circle, PlayCircle, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface TaskDetailsPanelProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  isOpen: boolean;
  onToggle: () => void;
}

type FilterStatus = 'all' | 'not-started' | 'in-progress' | 'completed';

export default function TaskDetailsPanel({ tasks, onEditTask, isOpen, onToggle }: TaskDetailsPanelProps) {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const statusConfig = {
    'not-started': {
      icon: Circle,
      color: 'text-gray-500',
      bg: 'bg-gray-100',
      label: 'Todo',
    },
    'in-progress': {
      icon: PlayCircle,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
      label: 'In Progress',
    },
    completed: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-100',
      label: 'Completed',
    },
  };

  const panelWidth = '500px';

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(task => task.status === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.assignedTo?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, activeFilter, searchQuery]);

  const taskCounts = {
    all: tasks.length,
    'not-started': tasks.filter(t => t.status === 'not-started').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <>
      {/* Floating open button when panel is closed */}
      {!isOpen && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="fixed right-4 top-24  bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center w-12 h-12 cursor-pointer"
          title="Open task details"
          aria-label="Open task details"
          style={{ zIndex: 100, position: 'fixed' }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}
      
      {/* Panel */}
      {isOpen && (
        <div
          className="bg-white shadow-xl border-l border-gray-200 flex flex-col shrink-0 relative"
          style={{ 
            width: panelWidth,
            minWidth: panelWidth,
            maxWidth: panelWidth,
            height: '100vh'
          }}
        >
        {/* Header */}
        <div className="shrink-0 p-6  border-b border-gray-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <Table className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 truncate">Task Details</h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onToggle}
                className="p-2 hover:bg-white rounded-md transition-colors border border-transparent hover:border-gray-300"
                title="Close panel"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-sm">View and manage all tasks</p>
        </div>

        {/* Filter Tabs */}
        <div className="shrink-0 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-1 px-4 pt-3 overflow-x-auto">
            {[
              { value: 'all' as FilterStatus, label: 'All', count: taskCounts.all },
              { value: 'not-started' as FilterStatus, label: 'Todo', count: taskCounts['not-started'] },
              { value: 'in-progress' as FilterStatus, label: 'Active', count: taskCounts['in-progress'] },
              { value: 'completed' as FilterStatus, label: 'Done', count: taskCounts.completed },
            ].map((filter) => {
              const config = filter.value === 'all' ? null : statusConfig[filter.value];
              const StatusIcon = config?.icon;
              
              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium text-sm transition-all whitespace-nowrap ${
                    activeFilter === filter.value
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {StatusIcon && <StatusIcon className={`w-4 h-4 ${config.color}`} />}
                  <span>{filter.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeFilter === filter.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="shrink-0 p-4 bg-gray-50 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <Table className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No tasks yet</p>
              <p className="text-gray-400 text-xs mt-1">Tasks will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm font-medium">No tasks found</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {searchQuery ? 'Try a different search term' : 'No tasks match the selected filter'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <div className="text-xs text-gray-500 px-2">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                  </div>
                  
                  {/* Task Table */}
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b-2 border-gray-200">
                          <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase">Task</th>
                          <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase">Status</th>
                          <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase">Assigned To</th>
                          <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase">Dates</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.map((task, index) => {
                          const config = statusConfig[task.status];
                          const StatusIcon = config.icon;
                          
                          return (
                            <tr
                              key={task.id}
                              onClick={() => onEditTask(task)}
                              className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-all hover:shadow-sm group"
                            >
                              <td className="p-3">
                                <div className="font-medium text-sm text-gray-900 group-hover:text-blue-700 transition-colors">{task.name}</div>
                                {task.description && (
                                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</div>
                                )}
                              </td>
                              <td className="p-3">
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                                  <StatusIcon className="w-3.5 h-3.5" />
                                  {config.label}
                                </div>
                              </td>
                              <td className="p-3">
                                {task.assignedTo ? (
                                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                    <User className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="truncate max-w-[120px]">{task.assignedTo}</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400 italic">Unassigned</span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                  <span>{format(new Date(task.startDate), 'MMM dd')}</span>
                                  <span>→</span>
                                  <span>{format(new Date(task.endDate), 'MMM dd')}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        </div>
      )}
    </>
  );
}

