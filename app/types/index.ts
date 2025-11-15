export interface Task {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  dependencies: string[]; // Array of task IDs that this task depends on
  status: 'not-started' | 'in-progress' | 'completed';
  assignedTo?: string; // User ID or email
  completionImage?: string; // URL to uploaded image
  createdAt: string;
  updatedAt: string;
}

export interface TaskNode {
  id: string;
  type: string;
  data: {
    task: Task;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface TaskEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
}
