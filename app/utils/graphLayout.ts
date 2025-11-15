import { Task } from '../types';

export function calculateNodePositions(tasks: Task[]): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  
  if (tasks.length === 0) return positions;

  // Build adjacency list for topological sort
  const adjList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  
  tasks.forEach(task => {
    adjList.set(task.id, []);
    inDegree.set(task.id, 0);
  });

  tasks.forEach(task => {
    task.dependencies.forEach(depId => {
      if (adjList.has(depId)) {
        adjList.get(depId)!.push(task.id);
        inDegree.set(task.id, (inDegree.get(task.id) || 0) + 1);
      }
    });
  });

  // Topological sort to determine levels
  const levels = new Map<string, number>();
  const queue: string[] = [];

  tasks.forEach(task => {
    if (inDegree.get(task.id) === 0) {
      queue.push(task.id);
      levels.set(task.id, 0);
    }
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentLevel = levels.get(current) || 0;

    adjList.get(current)?.forEach(neighbor => {
      const newInDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newInDegree);
      
      const newLevel = Math.max(levels.get(neighbor) || 0, currentLevel + 1);
      levels.set(neighbor, newLevel);

      if (newInDegree === 0) {
        queue.push(neighbor);
      }
    });
  }

  // Handle any remaining tasks (cycles or disconnected)
  tasks.forEach(task => {
    if (!levels.has(task.id)) {
      levels.set(task.id, 0);
    }
  });

  // Group tasks by level
  const tasksByLevel = new Map<number, string[]>();
  levels.forEach((level, taskId) => {
    if (!tasksByLevel.has(level)) {
      tasksByLevel.set(level, []);
    }
    tasksByLevel.get(level)!.push(taskId);
  });

  // Calculate positions
  const HORIZONTAL_SPACING = 350;
  const VERTICAL_SPACING = 180;
  const START_X = 50;
  const START_Y = 50;

  tasksByLevel.forEach((taskIds, level) => {
    const levelHeight = taskIds.length * VERTICAL_SPACING;
    const startY = START_Y - (levelHeight / 2) + (VERTICAL_SPACING / 2);

    taskIds.forEach((taskId, index) => {
      positions.set(taskId, {
        x: START_X + level * HORIZONTAL_SPACING,
        y: startY + index * VERTICAL_SPACING,
      });
    });
  });

  return positions;
}
