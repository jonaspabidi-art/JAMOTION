import { useEffect, useRef } from 'react'
import { useStore } from '../store'
import styles from './Timeline.module.css'

export default function Timeline() {
  const isPlaying = useStore((s) => s.isPlaying)
  const currentTime = useStore((s) => s.currentTime)
  const duration = useStore((s) => s.duration)
  const setIsPlaying = useStore((s) => s.setIsPlaying)
  const setCurrentTime = useStore((s) => s.setCurrentTime)
  const restart = useStore((s) => s.restart)
  const audioSrc = useStore((s) => s.audioSrc)
  const audioVolume = useStore((s) => s.audioVolume)

  const rafRef = useRef(null)
  const lastRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    if (isPlaying) {
      lastRef.current = null
      const tick = (now) => {
        if (lastRef.current === null) lastRef.current = now
        const dt = (now - lastRef.current) / 1000
        lastRef.current = now
        const next = currentTime + dt
        if (next >= duration) {
          setCurrentTime(duration)
          setIsPlaying(false)
        } else {
          setCurrentTime(next)
          rafRef.current = requestAnimationFrame(tick)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
      audioRef.current?.play()
    } else {
      cancelAnimationFrame(rafRef.current)
      audioRef.current?.pause()
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = audioVolume
  }, [audioVolume])

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0

  const onScrub = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const t = (x / rect.width) * duration
    setCurrentTime(t)
    if (audioRef.current) audioRef.current.currentTime = t
  }

  const fmt = (s) => `${Math.floor(s)}:${String(Math.floor((s % 1) * 10)).padStart(1, '0')}`

  return (
    <div className={styles.bar}>
      {audioSrc && <audio ref={audioRef} src={audioSrc} />}

      <button
        className={styles.btn}
        onClick={() => {
          if (currentTime >= duration) {
            restart()
          } else {
            setIsPlaying(!isPlaying)
          }
        }}
        title={isPlaying ? 'Pausa' : 'Spela upp'}
      >
        {isPlaying ? (
          <svg width={18} height={18} fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg width={18} height={18} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        )}
      </button>

      <button
        className={styles.btn}
        onClick={() => { setCurrentTime(0); setIsPlaying(false); if (audioRef.current) audioRef.current.currentTime = 0 }}
        title="Aterstall"
      >
        <svg width={16} height={16} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 5V2L7 7l5 5V8c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        </svg>
      </button>

      <div className={styles.scrubber} onClick={onScrub}>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
          <div className={styles.thumb} style={{ left: `${pct}%` }} />
        </div>
      </div>

      <span className={styles.time}>
        {fmt(currentTime)}<span className={styles.total}> / {fmt(duration)}</span>
      </span>
    </div>
  )
}
