'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useTaskStore } from '@/store/taskStore'

export default function TaskInput() {
  const [title, setTitle] = useState('')
  const { addTask } = useTaskStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    addTask(trimmed)
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="添加新任务..."
        className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-[#2a2a2a] border border-black/5 dark:border-white/10 text-sm outline-none focus:ring-2 focus:ring-[#7c9a8e]/30 transition-all placeholder:text-[var(--muted)]"
      />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-4 py-2.5 rounded-xl bg-[#7c9a8e] text-white text-sm font-medium hover:bg-[#6b8a7e] transition-colors flex items-center gap-1.5"
      >
        <Plus size={16} />
        添加
      </motion.button>
    </form>
  )
}
