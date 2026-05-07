'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Sun, Moon, X } from 'lucide-react'
import { useTimerStore } from '@/store/timerStore'
import { useSettingsStore } from '@/store/settingsStore'

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    focusDuration, shortBreakDuration, longBreakDuration, targetSessions,
    setDurations, setTargetSessions,
  } = useTimerStore()
  const { theme, toggleTheme } = useSettingsStore()

  const [localFocus, setLocalFocus] = useState(focusDuration)
  const [localShortBreak, setLocalShortBreak] = useState(shortBreakDuration)
  const [localLongBreak, setLocalLongBreak] = useState(longBreakDuration)
  const [localTarget, setLocalTarget] = useState(targetSessions)

  const handleSave = () => {
    setDurations(localFocus, localShortBreak, localLongBreak)
    setTargetSessions(localTarget)
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        aria-label="设置"
      >
        <Settings size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 bottom-8 sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:max-w-md sm:mx-auto z-50 bg-white dark:bg-[#2a2a2a] rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-medium">设置</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Timer durations */}
                <div>
                  <label className="text-xs text-[var(--muted)] block mb-2">时长设置（分钟）</label>
                  <div className="space-y-3">
                    {[
                      { label: '专注', value: localFocus, set: setLocalFocus, min: 1, max: 120 },
                      { label: '短休息', value: localShortBreak, set: setLocalShortBreak, min: 1, max: 30 },
                      { label: '长休息', value: localLongBreak, set: setLocalLongBreak, min: 1, max: 60 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="text-sm w-16">{item.label}</span>
                        <input
                          type="range"
                          min={item.min}
                          max={item.max}
                          value={item.value}
                          onChange={(e) => item.set(Number(e.target.value))}
                          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-black/10 dark:bg-white/10"
                          style={{
                            background: `linear-gradient(to right, #7c9a8e ${(item.value / item.max) * 100}%, transparent ${(item.value / item.max) * 100}%)`,
                          }}
                        />
                        <span className="text-sm w-8 text-right tabular-nums">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target sessions */}
                <div>
                  <label className="text-xs text-[var(--muted)] block mb-2">长休息间隔</label>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">每</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={localTarget}
                      onChange={(e) => setLocalTarget(Number(e.target.value))}
                      className="w-16 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-sm text-center outline-none focus:ring-2 focus:ring-[#7c9a8e]/30"
                    />
                    <span className="text-sm">个专注后长休息</span>
                  </div>
                </div>

                {/* Theme */}
                <div className="flex items-center justify-between">
                  <span className="text-sm">主题</span>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-sm hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
                  >
                    {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
                    {theme === 'light' ? '浅色' : '深色'}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full mt-6 py-2.5 rounded-xl bg-[#7c9a8e] text-white text-sm font-medium hover:bg-[#6b8a7e] transition-colors"
              >
                保存设置
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
