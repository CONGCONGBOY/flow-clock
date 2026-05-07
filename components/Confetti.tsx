'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiProps {
  trigger: boolean
}

const COLORS = ['#7c9a8e', '#c4a88a', '#d4a5a5', '#8ab4c4', '#b4c4a8']

export default function Confetti({ trigger }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([])

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
      }))
      setParticles(newParticles)
      const timer = setTimeout(() => setParticles([]), 2500)
      return () => clearTimeout(timer)
    }
  }, [trigger])

  return (
    <AnimatePresence>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed top-0 w-2 h-2 rounded-sm z-50 pointer-events-none"
          style={{ left: `${p.x}%`, backgroundColor: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: '100vh', opacity: 0, rotate: 720 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </AnimatePresence>
  )
}
