'use client'

import { motion } from 'framer-motion'
import { useTimerStore } from '@/store/timerStore'

export default function DynamicBackground() {
  const { totalFocusSeconds, isRunning, mode } = useTimerStore()
  const minutes = Math.floor(totalFocusSeconds / 60)
  const isFocus = mode === 'focus'

  // Growth stages based on focus time
  const growth = Math.min(minutes / 120, 1) // Full growth at 2 hours
  const stage = growth < 0.25 ? 0 : growth < 0.5 ? 1 : growth < 0.75 ? 2 : 3

  const treeScale = 0.3 + growth * 0.7
  const leafColor = `hsl(${120 + growth * 30}, ${50 + growth * 30}%, ${45 - growth * 15}%)`

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Sky gradient */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `linear-gradient(
            180deg,
            ${isFocus ? `rgba(124, 154, 142, ${0.05 + growth * 0.08})` : 'rgba(196, 168, 138, 0.05)'} 0%,
            transparent 100%
          )`,
        }}
      />

      {/* Stars - appear in deep focus */}
      {isFocus && growth > 0.3 && (
        <div className="absolute inset-0">
          {Array.from({ length: Math.floor(growth * 20) }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-yellow-200"
              style={{
                left: `${(i * 37 + 13) % 100}%`,
                top: `${(i * 53 + 7) % 60}%`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2 + (i % 3),
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* Growing tree */}
      {isFocus && (
        <motion.div
          className="absolute bottom-8 right-8"
          initial={{ scale: 0 }}
          animate={{ scale: treeScale }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Trunk */}
          <motion.div
            className="w-2 mx-auto rounded-full"
            style={{
              height: 40 + growth * 60,
              background: `linear-gradient(to top, #5a4a3a, #8a7a6a)`,
            }}
          />
          {/* Canopy */}
          <motion.div
            className="relative -mt-2"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div
              className="w-16 h-16 rounded-full opacity-60 blur-sm"
              style={{ backgroundColor: leafColor }}
            />
            <div
              className="absolute -top-3 -left-2 w-12 h-12 rounded-full opacity-40 blur-sm"
              style={{ backgroundColor: leafColor }}
            />
            <div
              className="absolute top-1 left-4 w-10 h-10 rounded-full opacity-50 blur-sm"
              style={{ backgroundColor: `hsl(${120 + growth * 40}, 60%, 50%)` }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Ground glow during focus */}
      {isRunning && isFocus && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1"
          animate={{
            background: [
              'radial-gradient(ellipse at center, rgba(124,154,142,0.1) 0%, transparent 70%)',
              'radial-gradient(ellipse at center, rgba(124,154,142,0.15) 0%, transparent 70%)',
              'radial-gradient(ellipse at center, rgba(124,154,142,0.1) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </div>
  )
}
