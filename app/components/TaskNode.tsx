'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Task } from '../types';
import { Calendar, Clock, CheckCircle2, Circle, PlayCircle, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

interface TaskNodeData {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskNode = memo(({ data }: NodeProps<TaskNodeData>) => {
  const { task, onEdit, onDelete } = data;

  const statusConfig = {
    'not-started': {
      icon: Circle,
      color: 'text-gray-400',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      label: 'Not Started',
    },
    'in-progress': {
      icon: PlayCircle,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      label: 'In Progress',
    },
    completed: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-50',
      border: 'border-green-200',
      label: 'Completed',
    },
  };

  const config = statusConfig[task.status];
  const StatusIcon = config.icon;

  return (
    <div className={`group relative bg-white rounded-xl shadow-lg border-2 ${config.border} min-w-[280px] max-w-[320px] hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden`}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500! border-2! border-white! shadow-md"
      />
      
      <div className={`px-4 py-3 rounded-t-xl ${config.bg} border-b ${config.border} backdrop-blur-sm`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
              {task.name}
            </h3>
          </div>
          <StatusIcon className={`${config.color} shrink-0 w-5 h-5 group-hover:scale-110 transition-transform duration-200`} />
        </div>
      </div>

      <div className="p-4 space-y-3 relative z-10">
        {task.description && (
          <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 px-2 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-blue-500" />
            <span className="font-medium">Start:</span>
            <span className="font-semibold text-blue-700">{format(new Date(task.startDate), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-purple-50 px-2 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 shrink-0 text-purple-500" />
            <span className="font-medium">End:</span>
            <span className="font-semibold text-purple-700">{format(new Date(task.endDate), 'MMM dd, yyyy')}</span>
          </div>
        </div>

        {/* Completion Image */}
        {task.status === 'completed' && task.completionImage && (
          <div className="mt-3 rounded-lg overflow-hidden border-2 border-green-200 shadow-md">
            <img
              src={task.completionImage}
              alt="Task completion"
              className="w-full h-32 object-cover"
            />
            <div className="bg-green-50 px-2 py-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-medium text-green-700">Completion Proof</span>
            </div>
          </div>
        )}

        {/* Assigned To */}
        {task.assignedTo && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
            <span className="font-medium">Assigned:</span>
            <span className="text-gray-700">{task.assignedTo}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className={`text-xs font-semibold ${config.color} px-2 py-1 rounded-full ${config.bg}`}>
            {config.label}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(task)}
              className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-all hover:scale-105 shadow-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-all hover:scale-105 shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500! border-2! border-white! shadow-md"
      />
    </div>
  );
});

TaskNode.displayName = 'TaskNode';

export default TaskNode;
