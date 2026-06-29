import { useRef } from 'react'
import { useStore } from '../store'
import { saveFile } from '../fileStore'
import styles from './BackgroundPanel.module.css'

const SOLID_PRESETS = ['#0f0f0f', '#ffffff', '#1a0a2e', '#0a1628', '#1a1a1a', '#0d1117', '#2d1b69', '#1a0a0a']

const GRADIENT_PRESETS = [
  { from: '#0f0f0f', to: '#1a0a2e', angle: 135, name: 'Natt' },
  { from: '#0a1628', to: '#1a3a5c', angle: 160, name: 'Hav' },
  { from: '#1a0a2e', to: '#6b35a8', angle: 135, name: 'Lila' },
  { from: '#0d1117', to: '#1f6b35', angle: 135, name: 'Djungel' },
  { from: '#2d0a0a', to: '#8b1a1a', angle: 135, name: 'Rod' },
  { from: '#0f0f0f', to: '#2a2a2a', angle: 180, name: 'Kol' },
  { from: '#7c6fff', to: '#ff6f91', angle: 135, name: 'Sunset' },
  { from: '#00c6ff', to: '#0072ff', angle: 135, name: 'Himmel' },
]

export default function BackgroundPanel() {
  const background = useStore((s) => s.background)
  const backgroundType = useStore((s) => s.backgroundType)
  const gradient = useStore((s) => s.gradient)
  const setBackground = useStore((s) => s.setBackground)
  const setGradient = useStore((s) => s.setGradient)
  const setBackgroundImage = useStore((s) => s.setBackgroundImage)
  const duration = useStore((s) => s.duration)
  const setDuration = useStore((s) => s.setDuration)

  const bgImgRef = useRef(null)

  const handleBgImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const key = await saveFile(file)
    setBackgroundImage(URL.createObjectURL(file), key)
    e.target.value = ''
  }

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Solid farg</p>
        <div className={styles.colorRow}>
          <input
            type="color"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className={styles.colorPicker}
          />
          <div className={styles.swatches}>
            {SOLID_PRESETS.map((c) => (
              <button
                key={c}
                className={`${styles.swatch} ${backgroundType === 'color' && background === c ? styles.activeSwatch : ''}`}
                style={{ background: c }}
                onClick={() => setBackground(c)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Gradient</p>
        <div className={styles.gradientGrid}>
          {GRADIENT_PRESETS.map((g) => (
            <button
              key={g.name}
              className={`${styles.gradientBtn} ${backgroundType === 'gradient' && gradient.from === g.from ? styles.activeGrad : ''}`}
              style={{ background: `linear-gradient(${g.angle}deg, ${g.from}, ${g.to})` }}
              onClick={() => setGradient(g)}
            >
              <span>{g.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Bakgrundsbild</p>
        <button className={styles.uploadBtn} onClick={() => bgImgRef.current?.click()}>
          <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" />
            <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1={12} y1={3} x2={12} y2={15} strokeLinecap="round" />
          </svg>
          Ladda upp bild
        </button>
        <input ref={bgImgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBgImage} />
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Langd</p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="range"
            min={1}
            max={30}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--accent)', background: 'transparent', border: 'none', padding: 0 }}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: 12, minWidth: 30 }}>{duration}s</span>
        </div>
      </div>
    </div>
  )
}
