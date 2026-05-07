'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ListTodo } from 'lucide-react'
import Timer from '@/components/timer/Timer'
import TaskInput from '@/components/tasks/TaskInput'
import TaskList from '@/components/tasks/TaskList'
import SoundMixer from '@/components/sound/SoundMixer'
import MoodLogger from '@/components/mood/MoodLogger'
import SettingsPanel from '@/components/SettingsPanel'
import Confetti from '@/components/Confetti'
import DynamicBackground from '@/components/background/DynamicBackground'
import { useTimerStore } from '@/store/timerStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useTaskStore } from '@/store/taskStore'

export default function Home() {
  const { mode, isRunning, timeLeft, targetSessions, sessionsCompleted, totalFocusSeconds } = useTimerStore()
  const { zenMode, loadFromStorage } = useSettingsStore()
  const { loadFromStorage: loadTasks, tasks } = useTaskStore()
  const [showTasks, setShowTasks] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Load persisted state on mount
  useEffect(() => {
    loadFromStorage()
    loadTasks()
  }, [loadFromStorage, loadTasks])

  // Confetti on completing a session target
  useEffect(() => {
    if (sessionsCompleted > 0 && sessionsCompleted % targetSessions === 0 && mode === 'focus') {
      setShowConfetti(true)
      const t = setTimeout(() => setShowConfetti(false), 2500)
      return () => clearTimeout(t)
    }
  }, [sessionsCompleted, targetSessions, mode])

  return (
    <>
      <DynamicBackground />
      <Confetti trigger={showConfetti} />

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="w-8 h-8 rounded-lg bg-[#7c9a8e] flex items-center justify-center"
            >
              <Sparkles size={16} className="text-white" />
            </motion.div>
            {!zenMode && (
              <span className="text-sm font-medium tracking-wide">
                心流·智钟
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <MoodLogger />
            <SoundMixer />
            <button
              onClick={() => setShowTasks(!showTasks)}
              className={`p-2 rounded-xl transition-colors ${
                showTasks
                  ? 'bg-[#7c9a8e]/10 text-[#7c9a8e]'
                  : 'text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/10'
              }`}
              aria-label="任务列表"
            >
              <ListTodo size={18} />
            </button>
            <SettingsPanel />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <Timer />
          </motion.div>
        </main>

        {/* Task panel - slide up */}
        <motion.div
          initial={false}
          animate={{
            height: showTasks ? 'auto' : 0,
            opacity: showTasks ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden border-t border-black/5 dark:border-white/10"
        >
          <div className="px-4 sm:px-6 py-4 max-w-lg mx-auto space-y-4">
            <TaskInput />
            <TaskList />
          </div>
        </motion.div>

        {/* Bottom stats bar */}
        {!zenMode && (
          <footer className="px-4 sm:px-6 py-3 border-t border-black/5 dark:border-white/10">
            <div className="max-w-lg mx-auto flex items-center justify-between text-xs text-[var(--muted)]">
              <span>🍅 已完成 {sessionsCompleted} 个番茄</span>
              <span>⏱ 今日专注 {Math.floor(totalFocusSeconds / 60)} 分钟</span>
              <span>📋 {tasks.filter((t) => !t.completed).length} 个待办</span>
            </div>
          </footer>
        )}
      </div>
    </>
  )
}
