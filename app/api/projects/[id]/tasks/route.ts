import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import Task from '@/lib/models/Task';

// GET all tasks for a project
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    // Check if user has access to this project
    const project = await Project.findOne({
      _id: id,
      $or: [
        { ownerId: userId },
        { 'members.userId': userId }
      ]
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const tasks = await Task.find({ projectId: id }).sort({ createdAt: -1 });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create a new task
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, startDate, endDate, status, dependencies, assignedTo, completionImage } = body;

    await connectDB();

    // Check if user has write access (owner or manager)
    const project = await Project.findOne({
      _id: id,
      $or: [
        { ownerId: userId },
        { 'members.userId': userId, 'members.role': { $in: ['owner', 'manager'] } }
      ]
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or insufficient permissions' }, { status: 403 });
    }

    const task = await Task.create({
      projectId: id,
      name,
      description,
      startDate,
      endDate,
      status: status || 'not-started',
      dependencies: dependencies || [],
      assignedTo: assignedTo || undefined,
      completionImage: completionImage || undefined,
      createdBy: userId,
      updatedBy: userId,
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
