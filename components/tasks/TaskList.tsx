'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Trash2, Circle } from 'lucide-react'
import { useTaskStore } from '@/store/taskStore'

export default function TaskList() {
  const { tasks, loadFromStorage, toggleTask, deleteTask } = useTaskStore()

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  const activeTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-[var(--muted)]">
        <p>暂无任务</p>
        <p className="text-xs mt-1 opacity-60">添加一个任务开始你的专注之旅</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <AnimatePresence mode="popLayout">
        {activeTasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <button
              onClick={() => toggleTask(task.id)}
              className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#7c9a8e] flex items-center justify-center hover:bg-[#7c9a8e]/10 transition-colors"
            >
              {task.completed && <Check size={12} className="text-[#7c9a8e]" />}
            </button>
            <span className="flex-1 text-sm">{task.title}</span>
            <span className="text-xs text-[var(--muted)]">
              {task.completedPomodoros}/{task.estimatedPomodoros} 🍅
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 text-[var(--muted)] hover:text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {completedTasks.length > 0 && (
        <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/10">
          <details className="group">
            <summary className="text-xs text-[var(--muted)] cursor-pointer hover:opacity-80 transition-opacity">
              已完成 ({completedTasks.length})
            </summary>
            <div className="mt-2 space-y-1">
              <AnimatePresence>
                {completedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl opacity-50"
                  >
                    <Circle size={10} className="text-[#7c9a8e] fill-[#7c9a8e]" />
                    <span className="text-sm line-through">{task.title}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
