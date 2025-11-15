'use client';

import React from 'react';
import { X, BookOpen, CheckCircle2, PlayCircle, Circle, ArrowRight, Users, Calendar, Download, Upload, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuideProps {
  onClose: () => void;
}

export default function Guide({ onClose }: GuideProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to TaskFlow</h2>
              <p className="text-sm text-gray-600">Your complete guide to project management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Overview Section */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-600" />
              Overview
            </h3>
            <p className="text-gray-700 leading-relaxed">
              TaskFlow is a modern project management application that visualizes tasks as an interactive network diagram. 
              It helps you understand task dependencies and project flow at a glance. Manage your projects, collaborate with 
              team members, and track progress visually.
            </p>
          </section>

          {/* Getting Started */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-blue-600" />
              Getting Started
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Creating Your First Task</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Click <strong>"Add New Task"</strong> in the sidebar</li>
                  <li>Fill in the required information:
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                      <li><strong>Task Name</strong>: A clear, descriptive name (Required)</li>
                      <li><strong>Description</strong>: Additional details about the task (Optional)</li>
                      <li><strong>Start Date</strong>: When work on this task begins (Required)</li>
                      <li><strong>End Date</strong>: Target completion date (Required)</li>
                      <li><strong>Status</strong>: Current state - Not Started, In Progress, or Completed</li>
                      <li><strong>Dependencies</strong>: Select tasks that must be completed before this one</li>
                    </ul>
                  </li>
                  <li>Click <strong>"Create Task"</strong></li>
                </ol>
              </div>
            </div>
          </section>

          {/* Network Diagram */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-600" />
              Understanding the Network Diagram
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Task Nodes</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-500 rounded"></div>
                    <span><strong>Green border</strong> = Completed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
                    <span><strong>Blue border</strong> = In Progress</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
                    <span><strong>Gray border</strong> = Not Started</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Connections</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Blue arrows show dependencies</li>
                  <li>Arrow points FROM prerequisite task TO dependent task</li>
                  <li>Animated lines indicate active connections</li>
                  <li>Tasks are automatically arranged from left to right</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Navigation & Interaction</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Canvas Controls</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <strong>Zoom</strong>: Scroll wheel or pinch gesture</li>
                  <li>• <strong>Pan</strong>: Click and drag on empty canvas</li>
                  <li>• <strong>Fit to View</strong>: Click the fit button in controls</li>
                  <li>• <strong>Zoom In/Out</strong>: Use control buttons on left side</li>
                </ul>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Task Operations</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <strong>View Details</strong>: Click any task card</li>
                  <li>• <strong>Edit Task</strong>: Click "Edit" button on task or in sidebar</li>
                  <li>• <strong>Delete Task</strong>: Click "Delete" button (confirms before deleting)</li>
                  <li>• <strong>Move Task</strong>: Drag task to reposition manually</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Key Features
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <Users className="w-6 h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-2">Team Collaboration</h4>
                <p className="text-sm text-gray-700">
                  Invite team members, assign roles (Owner, Manager, Viewer), and collaborate on projects together.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <Download className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-2">Export & Import</h4>
                <p className="text-sm text-gray-700">
                  Export projects as JSON or CSV files. Import previously exported projects to restore your work.
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <Calendar className="w-6 h-6 text-orange-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-2">Task Management</h4>
                <p className="text-sm text-gray-700">
                  Create, edit, and delete tasks. Set dependencies, track status, and manage deadlines.
                </p>
              </div>
            </div>
          </section>

          {/* Sidebar Features */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Sidebar Features</h3>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Statistics Dashboard</strong>: View total tasks, completed, in progress, and not started counts
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Task List</strong>: See all tasks in order with color-coded status indicators
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Quick Actions</strong>: Add new tasks, clear all tasks (with confirmation), and manage your workflow
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Best Practices */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Best Practices</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Circle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-gray-900">Break down work</strong>
                  <p className="text-sm text-gray-600">Create small, manageable tasks for better tracking</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Circle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-gray-900">Clear naming</strong>
                  <p className="text-sm text-gray-600">Use descriptive task names with action verbs</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Circle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-gray-900">Set realistic dates</strong>
                  <p className="text-sm text-gray-600">Include buffer time in your planning</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Circle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-gray-900">Update status regularly</strong>
                  <p className="text-sm text-gray-600">Keep task states current for accurate progress tracking</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="bg-blue-50p-6 rounded-lg border border-blue-200 p-2">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Pro Tips</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <span>Start with major milestones, then add detailed tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <span>Use status colors to quickly see project progress</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <span>Export your projects regularly for backups</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <span>Define task dependencies before detailed scheduling</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            You can access this guide anytime from the project menu
          </p>
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

