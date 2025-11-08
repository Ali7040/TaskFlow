'use client';

import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface QuickStartGuideProps {
  onClose: () => void;
}

export default function QuickStartGuide({ onClose }: QuickStartGuideProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-900">
            🚀 Quick Start Guide
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Welcome */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Welcome to TaskFlow!
              </h3>
              <p className="text-blue-700 text-sm">
                TaskFlow helps you visualize and manage your project tasks using interactive network diagrams.
                Follow the steps below to get started.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Create Your First Task</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Click the <span className="font-medium text-blue-600">"Add New Task"</span> button in the sidebar to create a new task.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>Enter a task name and description</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>Set start and end dates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>Choose the task status</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Add More Tasks</h4>
                  <p className="text-sm text-gray-600">
                    Continue creating tasks for your project. Each task will appear as a node in the network diagram.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Define Task Dependencies</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    When creating or editing a task, select which tasks it depends on. This creates connections in the diagram.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800">
                    💡 <strong>Tip:</strong> Dependencies show which tasks must be completed before others can start.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Visualize & Manage</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Use the interactive diagram to:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>Zoom and pan to navigate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>Click tasks to edit them</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>Use the minimap for overview</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Export & Save</h4>
                  <p className="text-sm text-gray-600">
                    Your data is automatically saved in your browser. You can also export your project as JSON and import it later.
                  </p>
                </div>
              </div>
            </div>

            {/* Color Legend */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Task Status Colors</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-xs text-gray-700">Not Started</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-blue-700">In Progress</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-700">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 font-medium text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Got it, Let's Start!
          </button>
        </div>
      </div>
    </div>
  );
}
