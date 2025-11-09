import mongoose, { Schema, Document } from 'mongoose';

export type TaskStatus = 'not-started' | 'in-progress' | 'completed';

export interface ITask extends Document {
  projectId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  dependencies: string[];
  assignedTo?: string; // User ID or email
  completionImage?: string; // URL to uploaded image
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    projectId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started'
    },
    dependencies: [{ type: String }],
    assignedTo: { type: String },
    completionImage: { type: String },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient queries
TaskSchema.index({ projectId: 1, createdAt: -1 });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
