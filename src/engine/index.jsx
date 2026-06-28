import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react'

// ── Easing ──────────────────────────────────────────────────────────────────
export const Easing = {
  linear: (t) => t,
  easeInQuad:    (t) => t * t,
  easeOutQuad:   (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic:    (t) => t * t * t,
  easeOutCubic:   (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInExpo:  (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInSine:    (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine:   (t) => Math.sin((t * Math.PI) / 2),
  easeOutBack: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2) },
  easeInBack:  (t) => { const c1 = 1.70158, c3 = c1 + 1; return c3 * t * t * t - c1 * t * t },
  easeOutElastic: (t) => {
    if (t === 0) return 0; if (t === 1) return 1
    const c4 = (2 * Math.PI) / 3
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },
}

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

export function interpolate(input, output, ease = Easing.linear) {
  return (t) => {
    if (t <= input[0]) return output[0]
    if (t >= input[input.length - 1]) return output[output.length - 1]
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i]
        const local = span === 0 ? 0 : (t - input[i]) / span
        const easeFn = Array.isArray(ease) ? (ease[i] || Easing.linear) : ease
        return output[i] + (output[i + 1] - output[i]) * easeFn(local)
      }
    }
    return output[output.length - 1]
  }
}

export function animate({ from = 0, to = 1, start = 0, end = 1, ease = Easing.easeInOutCubic }) {
  return (t) => {
    if (t <= start) return from
    if (t >= end) return to
    return from + (to - from) * ease((t - start) / (end - start))
  }
}

// ── Timeline context ─────────────────────────────────────────────────────────
const TimelineContext = createContext({ time: 0, duration: 10, playing: false, setTime: () => {}, setPlaying: () => {} })
export const useTime = () => useContext(TimelineContext).time
export const useTimeline = () => useContext(TimelineContext)

// ── Sprite ───────────────────────────────────────────────────────────────────
const SpriteContext = createContext({ localTime: 0, progress: 0, duration: 0, visible: false })
export const useSprite = () => useContext(SpriteContext)

export function Sprite({ start = 0, end = Infinity, children, keepMounted = false }) {
  const { time } = useTimeline()
  const visible = time >= start && time <= end
  if (!visible && !keepMounted) return null
  const duration = end - start
  const localTime = Math.max(0, time - start)
  const progress = duration > 0 && isFinite(duration) ? clamp(localTime / duration, 0, 1) : 0
  const value = { localTime, progress, duration, visible }
  return (
    <SpriteContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </SpriteContext.Provider>
  )
}

// ── Stage ────────────────────────────────────────────────────────────────────
export function Stage({ width = 1080, height = 1080, duration = 10, background = '#0f0f0f', loop = true, autoplay = true, children, onTimeChange }) {
  const [time, setTimeRaw] = useState(0)
  const [playing, setPlaying] = useState(autoplay)
  const [scale, setScale] = useState(1)
  const stageRef = useRef(null)
  const rafRef = useRef(null)
  const lastTsRef = useRef(null)

  const setTime = useCallback((t) => {
    const clamped = typeof t === 'function' ? t : clamp(t, 0, duration)
    setTimeRaw(typeof t === 'function' ? (prev) => { const v = clamp(t(prev), 0, duration); onTimeChange?.(v); return v } : clamped)
    if (typeof t !== 'function') onTimeChange?.(clamped)
  }, [duration, onTimeChange])

  useEffect(() => {
    if (!stageRef.current) return
    const el = stageRef.current
    const measure = () => {
      const s = Math.min(el.clientWidth / width, el.clientHeight / height)
      setScale(Math.max(0.01, s))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width, height])

  useEffect(() => {
    if (!playing) { lastTsRef.current = null; return }
    const step = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts
      const dt = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts
      setTime((t) => {
        let next = t + dt
        if (next >= duration) { if (loop) next = next % duration; else { next = duration; setPlaying(false) } }
        return next
      })
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastTsRef.current = null }
  }, [playing, duration, loop])

  const ctx = useMemo(() => ({ time, duration, playing, setTime, setPlaying }), [time, duration, playing, setTime])

  return (
    <div ref={stageRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#000' }}>
      <div style={{ width, height, background, position: 'relative', transform: `scale(${scale})`, transformOrigin: 'center', flexShrink: 0, overflow: 'hidden' }}>
        <TimelineContext.Provider value={ctx}>
          {children}
        </TimelineContext.Provider>
      </div>
    </div>
  )
}
