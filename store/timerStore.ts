import { create } from 'zustand'

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

interface TimerState {
  mode: TimerMode
  timeLeft: number
  isRunning: boolean
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsCompleted: number
  totalFocusSeconds: number
  targetSessions: number

  setMode: (mode: TimerMode) => void
  setTimeLeft: (t: number) => void
  setIsRunning: (running: boolean) => void
  tick: () => void
  reset: () => void
  switchToNextMode: () => void
  setDurations: (f: number, s: number, l: number) => void
  setTargetSessions: (n: number) => void
  addFocusSecond: () => void
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'focus',
  timeLeft: 25 * 60,
  isRunning: false,
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsCompleted: 0,
  totalFocusSeconds: 0,
  targetSessions: 4,

  setMode: (mode) => {
    const d = get()
    const durations: Record<TimerMode, number> = {
      focus: d.focusDuration,
      shortBreak: d.shortBreakDuration,
      longBreak: d.longBreakDuration,
    }
    set({ mode, timeLeft: durations[mode] * 60, isRunning: false })
  },

  setTimeLeft: (t) => set({ timeLeft: t }),
  setIsRunning: (running) => set({ isRunning: running }),

  tick: () => {
    const { timeLeft, isRunning } = get()
    if (isRunning && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 })
    }
  },

  reset: () => {
    const d = get()
    const durations: Record<TimerMode, number> = {
      focus: d.focusDuration,
      shortBreak: d.shortBreakDuration,
      longBreak: d.longBreakDuration,
    }
    set({ timeLeft: durations[d.mode] * 60, isRunning: false })
  },

  switchToNextMode: () => {
    const d = get()
    const nextSessions = d.sessionsCompleted + 1
    const isLongBreak = nextSessions % d.targetSessions === 0

    if (d.mode === 'focus') {
      const nextMode: TimerMode = isLongBreak ? 'longBreak' : 'shortBreak'
      const durations: Record<TimerMode, number> = {
        focus: d.focusDuration,
        shortBreak: d.shortBreakDuration,
        longBreak: d.longBreakDuration,
      }
      set({
        mode: nextMode,
        timeLeft: durations[nextMode] * 60,
        isRunning: false,
        sessionsCompleted: nextSessions,
      })
    } else {
      set({
        mode: 'focus',
        timeLeft: d.focusDuration * 60,
        isRunning: false,
      })
    }
  },

  setDurations: (f, s, l) => {
    set({
      focusDuration: f,
      shortBreakDuration: s,
      longBreakDuration: l,
      timeLeft: f * 60,
      mode: 'focus',
      isRunning: false,
    })
  },

  setTargetSessions: (n) => set({ targetSessions: n }),
  addFocusSecond: () => set((s) => ({ totalFocusSeconds: s.totalFocusSeconds + 1 })),
}))
