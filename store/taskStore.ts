import { create } from 'zustand'

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: number
  estimatedPomodoros: number
  completedPomodoros: number
}

interface TaskState {
  tasks: Task[]
  addTask: (title: string, estimatedPomodoros?: number) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  incrementPomodoro: (id: string) => void
  loadFromStorage: () => void
}

const STORAGE_KEY = 'flow-clock-tasks'

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],

  addTask: (title, estimatedPomodoros = 1) => {
    const task: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: Date.now(),
      estimatedPomodoros,
      completedPomodoros: 0,
    }
    const tasks = [...get().tasks, task]
    set({ tasks })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  },

  toggleTask: (id) => {
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    )
    set({ tasks })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  },

  deleteTask: (id) => {
    const tasks = get().tasks.filter((t) => t.id !== id)
    set({ tasks })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  },

  incrementPomodoro: (id) => {
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, completedPomodoros: t.completedPomodoros + 1 } : t
    )
    set({ tasks })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        set({ tasks: JSON.parse(stored) })
      } catch { /* ignore */ }
    }
  },
}))
