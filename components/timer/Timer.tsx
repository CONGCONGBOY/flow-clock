'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { useTimerStore } from '@/store/timerStore'
import { useTaskStore } from '@/store/taskStore'
import { useSettingsStore } from '@/store/settingsStore'
import CircularProgress from './CircularProgress'
import { formatTime } from '@/lib/utils'

export default function Timer() {
  const {
    mode, timeLeft, isRunning, totalFocusSeconds,
    focusDuration, shortBreakDuration, longBreakDuration,
    tick, reset, switchToNextMode, setIsRunning, addFocusSecond,
  } = useTimerStore()
  const { tasks } = useTaskStore()
  const { zenMode } = useSettingsStore()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const activeTask = tasks.find((t) => !t.completed)

  const total = {
    focus: focusDuration * 60,
    shortBreak: shortBreakDuration * 60,
    longBreak: longBreakDuration * 60,
  }[mode]

  const progress = 1 - timeLeft / total
  const isFocus = mode === 'focus'

  const playComplete = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio()
      }
      // Use Web Audio API for a simple chime
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.value = 0.3
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
      osc.start()
      osc.stop(ctx.currentTime + 0.8)
    } catch { /* audio not available */ }
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        tick()
        if (isFocus) addFocusSecond()
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, tick, isFocus, addFocusSecond])

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      playComplete()
      setTimeout(() => switchToNextMode(), 500)
    }
  }, [timeLeft, isRunning, setIsRunning, switchToNextMode, playComplete])

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => reset()
  const handleSkip = () => {
    setIsRunning(false)
    switchToNextMode()
  }

  const modeColors: Record<string, string> = {
    focus: '#7c9a8e',
    shortBreak: '#c4a88a',
    longBreak: '#d4a5a5',
  }

  const modeLabels: Record<string, string> = {
    focus: '专注',
    shortBreak: '短休息',
    longBreak: '长休息',
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Mode indicator */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: modeColors[mode] }}
        />
        <span className="text-sm font-medium tracking-wider uppercase text-[var(--muted)]">
          {modeLabels[mode]}
        </span>
      </motion.div>

      {/* Circular timer */}
      <div className="relative flex items-center justify-center">
        <CircularProgress
          progress={progress}
          color={modeColors[mode]}
          size={zenMode ? 200 : 280}
        />

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={timeLeft}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`font-light tracking-widest tabular-nums ${
                zenMode ? 'text-4xl' : 'text-7xl sm:text-8xl'
              }`}
              style={{ color: isRunning ? modeColors[mode] : undefined }}
            >
              {zenMode ? '' : formatTime(timeLeft)}
            </motion.span>
          </AnimatePresence>
          {zenMode && (
            <span className="text-sm text-[var(--muted)] mt-2">
              禅定中...
            </span>
          )}
        </div>

        {/* Breathing glow ring */}
        {isRunning && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                `0 0 20px ${modeColors[mode]}22`,
                `0 0 40px ${modeColors[mode]}33`,
                `0 0 20px ${modeColors[mode]}22`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
          aria-label="重置"
        >
          <RotateCcw size={20} className="text-[var(--muted)]" />
        </motion.button>

        <motion.button
          onClick={isRunning ? handlePause : handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-5 rounded-full shadow-lg transition-all"
          style={{
            backgroundColor: modeColors[mode],
            boxShadow: `0 4px 20px ${modeColors[mode]}44`,
          }}
          aria-label={isRunning ? '暂停' : '开始'}
        >
          {isRunning ? (
            <Pause size={28} className="text-white" />
          ) : (
            <Play size={28} className="text-white ml-0.5" />
          )}
        </motion.button>

        <motion.button
          onClick={handleSkip}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
          aria-label="跳过"
        >
          <SkipForward size={20} className="text-[var(--muted)]" />
        </motion.button>
      </div>

      {/* Session info */}
      {!zenMode && (
        <div className="text-center text-sm text-[var(--muted)] space-y-1">
          <p>
            今日专注 {Math.floor(totalFocusSeconds / 60)} 分钟
          </p>
          {activeTask && (
            <p className="text-xs opacity-70">
              当前任务：{activeTask.title}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
