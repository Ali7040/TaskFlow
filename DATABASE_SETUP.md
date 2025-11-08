# Database Setup Guide for TaskFlow

## Overview
This guide will help you set up a database for TaskFlow. Currently, the app uses localStorage for data persistence, but for production use with authentication, you'll need a proper database.

## Recommended Database Options

### Option 1: Vercel Postgres (Recommended for Next.js on Vercel)

#### Step 1: Install Vercel Postgres
```bash
npm install @vercel/postgres
```

#### Step 2: Set up Vercel Postgres Database
1. Go to your Vercel project dashboard
2. Navigate to the "Storage" tab
3. Click "Create Database" and select "Postgres"
4. Copy the connection string to your `.env.local` file

#### Step 3: Install Drizzle ORM (Recommended)
```bash
npm install drizzle-orm drizzle-kit
npm install -D @types/pg
```

#### Step 4: Create Database Schema
Create `lib/db/schema.ts`:
```typescript
import { pgTable, uuid, text, timestamp, jsonb, varchar } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('not-started'),
  priority: varchar('priority', { length: 50 }).notNull().default('medium'),
  dependencies: jsonb('dependencies').notNull().default([]),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  assignee: text('assignee'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

#### Step 5: Create Database Connection
Create `lib/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });
```

#### Step 6: Create API Routes
Create `app/api/tasks/route.ts`:
```typescript
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
  return NextResponse.json(userTasks);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const newTask = await db.insert(tasks).values({
    ...body,
    userId,
  }).returning();

  return NextResponse.json(newTask[0]);
}
```

---

### Option 2: Supabase (Great for PostgreSQL with real-time features)

#### Step 1: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

#### Step 2: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the API URL and anon key to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

#### Step 3: Create Database Table
In Supabase SQL Editor, run:
```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'not-started',
  priority VARCHAR(50) NOT NULL DEFAULT 'medium',
  dependencies JSONB NOT NULL DEFAULT '[]',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  assignee TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

#### Step 4: Create Supabase Client
Create `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

### Option 3: MongoDB Atlas (NoSQL option)

#### Step 1: Install MongoDB Client
```bash
npm install mongodb mongoose
```

#### Step 2: Create MongoDB Atlas Cluster
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string and add to `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
```

#### Step 3: Create Mongoose Schema
Create `lib/db/models/Task.ts`:
```typescript
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: 'not-started' },
  priority: { type: String, default: 'medium' },
  dependencies: [String],
  startDate: Date,
  endDate: Date,
  assignee: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
```

---

## Migration Steps

### 1. Update Task Storage to Use Database
Replace `app/utils/storage.ts` with database calls.

### 2. Create API Routes
- `GET /api/tasks` - Get all tasks for user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### 3. Update React Hooks
Replace localStorage calls with API calls using `fetch` or `useSWR`.

Example with `useSWR`:
```bash
npm install swr
```

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Home() {
  const { data: tasks, mutate } = useSWR('/api/tasks', fetcher);
  
  const handleAddTask = async (taskData) => {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    mutate(); // Refresh data
  };
}
```

---

## Next Steps

1. **Choose a database option** based on your needs:
   - Vercel Postgres: Best for Next.js on Vercel
   - Supabase: Great for real-time features
   - MongoDB: Good for flexible schema

2. **Set up Clerk authentication** (already configured in this project)

3. **Create database schema** using the examples above

4. **Create API routes** to handle CRUD operations

5. **Update the frontend** to use API calls instead of localStorage

6. **Test thoroughly** before deploying to production

---

## Security Best Practices

1. Always validate user permissions in API routes using `auth()` from Clerk
2. Use environment variables for sensitive data
3. Enable Row Level Security (RLS) if using Supabase
4. Add proper indexes on user_id columns
5. Implement rate limiting on API routes
6. Sanitize user input before database queries

---

## Example Full Implementation

See the `DATABASE_IMPLEMENTATION.md` file for a complete step-by-step implementation guide with all code examples.
