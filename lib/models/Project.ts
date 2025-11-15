import mongoose, { Schema, Document } from 'mongoose';

export type ProjectRole = 'owner' | 'manager' | 'viewer';

export interface IProjectMember {
  userId: string;
  email: string;
  role: ProjectRole;
  invitedAt: Date;
  invitedBy: string;
}

export interface IProject extends Document {
  name: string;
  description?: string;
  ownerId: string;
  members: IProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectMemberSchema = new Schema<IProjectMember>({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['owner', 'manager', 'viewer'],
    required: true 
  },
  invitedAt: { type: Date, default: Date.now },
  invitedBy: { type: String, required: true },
});

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: String, required: true },
    members: [ProjectMemberSchema],
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
ProjectSchema.index({ ownerId: 1 });
ProjectSchema.index({ 'members.userId': 1 });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
