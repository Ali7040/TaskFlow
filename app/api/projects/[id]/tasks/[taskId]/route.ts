import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import Task from '@/lib/models/Task';

// PUT update task
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, taskId } = await params;
    const body = await request.json();

    await connectDB();

    const task = await Task.findById(taskId);
    
    if (!task || task.projectId !== id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check if user has write access
    const project = await Project.findOne({
      _id: id,
      $or: [
        { ownerId: userId },
        { 'members.userId': userId, 'members.role': { $in: ['owner', 'manager'] } }
      ]
    });

    if (!project) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Update task fields
    Object.assign(task, {
      ...body,
      updatedBy: userId,
    });

    await task.save();

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE task
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, taskId } = await params;
    await connectDB();

    const task = await Task.findById(taskId);
    
    if (!task || task.projectId !== id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check if user has write access
    const project = await Project.findOne({
      _id: id,
      $or: [
        { ownerId: userId },
        { 'members.userId': userId, 'members.role': { $in: ['owner', 'manager'] } }
      ]
    });

    if (!project) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    await Task.findByIdAndDelete(taskId);

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
