import { Task } from '../types';

const STORAGE_KEY = 'taskflow_tasks';

export const storageTasks = {
  getAll: (): Task[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  save: (tasks: Task[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  add: (task: Task): Task[] => {
    const tasks = storageTasks.getAll();
    const newTasks = [...tasks, task];
    storageTasks.save(newTasks);
    return newTasks;
  },

  update: (id: string, updates: Partial<Task>): Task[] => {
    const tasks = storageTasks.getAll();
    const newTasks = tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    storageTasks.save(newTasks);
    return newTasks;
  },

  delete: (id: string): Task[] => {
    const tasks = storageTasks.getAll();
    // Remove the task and also remove it from dependencies of other tasks
    const newTasks = tasks
      .filter(task => task.id !== id)
      .map(task => ({
        ...task,
        dependencies: task.dependencies.filter(depId => depId !== id),
      }));
    storageTasks.save(newTasks);
    return newTasks;
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
