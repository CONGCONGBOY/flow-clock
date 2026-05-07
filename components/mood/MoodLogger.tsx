'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Frown, Meh, Smile, Zap, Coffee, BookOpen, X } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'

const EMOTIONS = [
  { id: 'anxious', label: '焦虑', emoji: '😰', icon: Frown },
  { id: 'bored', label: '无聊', emoji: '😐', icon: Meh },
  { id: 'tired', label: '疲惫', emoji: '😴', icon: Coffee },
  { id: 'distracted', label: '分心', emoji: '🫣', icon: Zap },
  { id: 'motivated', label: '有动力', emoji: '💪', icon: Smile },
  { id: 'focused', label: '很专注', emoji: '🎯', icon: BookOpen },
]

export default function MoodLogger() {
  const [isOpen, setIsOpen] = useState(false)
  const { addMoodEntry, moodEntries } = useSettingsStore()
  const [selectedFeeling, setSelectedFeeling] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    if (!selectedFeeling) return
    addMoodEntry(selectedFeeling, note)
    setSelectedFeeling('')
    setNote('')
    setIsOpen(false)
  }

  // Show the last 3 mood entries
  const recentEntries = moodEntries.slice(0, 3)

  return (
    <>
      {/* Quick mood trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <Meh size={16} />
        记录心情
      </button>

      {/* Recent moods */}
      {recentEntries.length > 0 && (
        <div className="flex gap-1 px-3">
          {recentEntries.map((entry) => {
            const emotion = EMOTIONS.find((e) => e.id === entry.feeling)
            return (
              <span key={entry.id} className="text-sm" title={entry.note || emotion?.label}>
                {emotion?.emoji || '📝'}
              </span>
            )
          })}
        </div>
      )}

      {/* Modal */}
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium">你现在感觉怎么样？</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {EMOTIONS.map((emotion) => {
                  const isSelected = selectedFeeling === emotion.id
                  return (
                    <button
                      key={emotion.id}
                      onClick={() => setSelectedFeeling(emotion.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-[#7c9a8e]/10 ring-2 ring-[#7c9a8e]'
                          : 'hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <span className="text-2xl">{emotion.emoji}</span>
                      <span className="text-xs">{emotion.label}</span>
                    </button>
                  )
                })}
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="想说点什么？(可选)"
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-sm outline-none resize-none focus:ring-2 focus:ring-[#7c9a8e]/30 transition-all mb-4 placeholder:text-[var(--muted)]"
              />

              <button
                onClick={handleSubmit}
                disabled={!selectedFeeling}
                className="w-full py-2.5 rounded-xl bg-[#7c9a8e] text-white text-sm font-medium disabled:opacity-40 hover:bg-[#6b8a7e] transition-colors"
              >
                记录
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
