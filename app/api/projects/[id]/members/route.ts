import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';

// POST invite member to project
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
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    if (!['owner', 'manager', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    await connectDB();

    const project = await Project.findOne({
      _id: id,
      $or: [
        { ownerId: userId },
        { 'members.userId': userId, 'members.role': { $in: ['owner', 'manager'] } }
      ]
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or insufficient permissions' }, { status: 404 });
    }

    // Check if member already exists
    const existingMember = project.members.find((m: any) => m.email === email);
    if (existingMember) {
      return NextResponse.json({ error: 'Member already invited' }, { status: 400 });
    }

    // Add new member (userId will be updated when they accept invitation)
    project.members.push({
      userId: '', // Will be filled when user accepts invitation
      email,
      role,
      invitedAt: new Date(),
      invitedBy: userId,
    });

    await project.save();

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error inviting member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE remove member from project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const memberUserId = searchParams.get('userId');

    if (!memberUserId) {
      return NextResponse.json({ error: 'Member userId is required' }, { status: 400 });
    }

    await connectDB();

    const project = await Project.findOne({
      _id: id,
      $or: [
        { ownerId: userId },
        { 'members.userId': userId, 'members.role': { $in: ['owner', 'manager'] } }
      ]
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or insufficient permissions' }, { status: 404 });
    }

    // Can't remove owner
    if (project.ownerId === memberUserId) {
      return NextResponse.json({ error: 'Cannot remove project owner' }, { status: 400 });
    }

    project.members = project.members.filter((m: any) => m.userId !== memberUserId);
    await project.save();

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
