import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface MoodEntry {
  id: string
  timestamp: number
  feeling: string
  note: string
}

interface SettingsState {
  theme: Theme
  soundEnabled: boolean
  soundVolumes: Record<string, number>
  activeSounds: string[]
  zenMode: boolean
  moodEntries: MoodEntry[]

  toggleTheme: () => void
  setTheme: (t: Theme) => void
  setSoundEnabled: (v: boolean) => void
  setSoundVolume: (id: string, vol: number) => void
  toggleSound: (id: string) => void
  setZenMode: (v: boolean) => void
  addMoodEntry: (feeling: string, note: string) => void
  loadFromStorage: () => void
}

const STORAGE_KEY = 'flow-clock-settings'
const MOOD_KEY = 'flow-clock-moods'

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'light',
  soundEnabled: false,
  soundVolumes: {
    rain: 50,
    forest: 50,
    cafe: 50,
    fireplace: 50,
  },
  activeSounds: [],
  zenMode: false,
  moodEntries: [],

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    set({ theme: next })
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: next }))
      document.documentElement.classList.toggle('dark', next === 'dark')
    }
  },

  setTheme: (t) => {
    set({ theme: t })
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', t === 'dark')
    }
  },

  setSoundEnabled: (v) => set({ soundEnabled: v }),
  setSoundVolume: (id, vol) => {
    const vols = { ...get().soundVolumes, [id]: vol }
    set({ soundVolumes: vols })
  },
  toggleSound: (id) => {
    const current = get().activeSounds
    const next = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id]
    set({ activeSounds: next })
  },
  setZenMode: (v) => set({ zenMode: v }),

  addMoodEntry: (feeling, note) => {
    const entry: MoodEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      feeling,
      note,
    }
    const entries = [entry, ...get().moodEntries]
    set({ moodEntries: entries })
    if (typeof window !== 'undefined') {
      localStorage.setItem(MOOD_KEY, JSON.stringify(entries))
    }
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.theme) {
          set({ theme: data.theme })
          document.documentElement.classList.toggle('dark', data.theme === 'dark')
        }
      } catch { /* ignore */ }
    }
    const moods = localStorage.getItem(MOOD_KEY)
    if (moods) {
      try { set({ moodEntries: JSON.parse(moods) }) } catch { /* ignore */ }
    }
  },
}))
