'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Headphones } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'

interface SoundDef {
  id: string
  name: string
  emoji: string
  color: string
}

const SOUNDS: SoundDef[] = [
  { id: 'rain', name: '雨声', emoji: '🌧', color: '#6b8a9e' },
  { id: 'forest', name: '森林', emoji: '🌲', color: '#7c9a7e' },
  { id: 'cafe', name: '咖啡馆', emoji: '☕', color: '#c4a88a' },
  { id: 'fireplace', name: '壁炉', emoji: '🔥', color: '#d4896b' },
]

export default function SoundMixer() {
  const {
    soundEnabled, activeSounds, soundVolumes,
    setSoundEnabled, toggleSound, setSoundVolume,
  } = useSettingsStore()
  const audioContextRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<Map<string, OscillatorNode | AudioBufferSourceNode>>(new Map())

  const getContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    return audioContextRef.current
  }, [])

  useEffect(() => {
    if (!soundEnabled || activeSounds.length === 0) {
      nodesRef.current.forEach((node) => {
        try { node.disconnect() } catch { /* ignore */ }
      })
      nodesRef.current.clear()
      if (audioContextRef.current?.state === 'running') {
        audioContextRef.current.suspend()
      }
      return
    }

    const ctx = getContext()
    if (ctx.state === 'suspended') ctx.resume()

    // Generate noise for each active sound
    activeSounds.forEach((id) => {
      if (nodesRef.current.has(id)) return

      const vol = (soundVolumes[id] || 50) / 100
      const bufferSize = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * vol
      }

      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true

      // Apply filters based on sound type
      const filter = ctx.createBiquadFilter()
      switch (id) {
        case 'rain':
          filter.type = 'highpass'
          filter.frequency.value = 1000
          break
        case 'forest':
          filter.type = 'bandpass'
          filter.frequency.value = 500
          filter.Q.value = 0.5
          break
        case 'cafe':
          filter.type = 'bandpass'
          filter.frequency.value = 800
          filter.Q.value = 0.3
          break
        case 'fireplace':
          filter.type = 'lowpass'
          filter.frequency.value = 400
          break
      }

      const gain = ctx.createGain()
      gain.gain.value = vol * 0.3

      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      source.start()

      nodesRef.current.set(id, source)
    })

    return () => {
      nodesRef.current.forEach((node) => {
        try { node.disconnect() } catch { /* ignore */ }
      })
      nodesRef.current.clear()
    }
  }, [soundEnabled, activeSounds, soundVolumes, getContext])

  return (
    <div className="space-y-3">
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
          soundEnabled
            ? 'bg-[#7c9a8e]/10 text-[#7c9a8e]'
            : 'text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <Headphones size={16} />
        白噪音
        {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
      </button>

      <AnimatePresence>
        {soundEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {SOUNDS.map((sound) => {
              const isActive = activeSounds.includes(sound.id)
              return (
                <div key={sound.id} className="flex items-center gap-3 px-2">
                  <button
                    onClick={() => toggleSound(sound.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'text-white'
                        : 'text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    style={{ backgroundColor: isActive ? sound.color : 'transparent' }}
                  >
                    <span>{sound.emoji}</span>
                    <span>{sound.name}</span>
                  </button>
                  {isActive && (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={soundVolumes[sound.id] || 50}
                      onChange={(e) => setSoundVolume(sound.id, Number(e.target.value))}
                      className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${sound.color} ${soundVolumes[sound.id] || 50}%, transparent ${soundVolumes[sound.id] || 50}%)`,
                      }}
                    />
                  )}
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
