import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';

// GET all projects for the current user
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Find projects where user is owner or member
    const projects = await Project.find({
      $or: [
        { ownerId: userId },
        { 'members.userId': userId }
      ]
    }).sort({ updatedAt: -1 });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create a new project
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user details from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    await connectDB();

    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || '',
      ownerId: userId,
      members: [{
        userId,
        email: user.emailAddresses[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || '',
        role: 'owner',
        invitedAt: new Date(),
        invitedBy: userId,
      }],
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
