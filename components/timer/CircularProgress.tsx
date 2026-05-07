'use client'

import { motion } from 'framer-motion'

interface CircularProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
}

export default function CircularProgress({
  progress,
  size = 280,
  strokeWidth = 6,
  color = '#7c9a8e',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background ring */}
      <svg width={size} height={size} className="absolute -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-black/5 dark:text-white/10"
        />
      </svg>
      {/* Progress ring */}
      <svg width={size} height={size} className="absolute -rotate-90">
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="drop-shadow-[0_0_8px_rgba(124,154,142,0.3)]"
        />
      </svg>
    </div>
  )
}
