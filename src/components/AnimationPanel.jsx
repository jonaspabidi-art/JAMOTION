import { useStore } from '../store'
import { ANIMATIONS } from '../animations'
import styles from './AnimationPanel.module.css'

export default function AnimationPanel() {
  const layers = useStore((s) => s.layers)
  const selectedLayerId = useStore((s) => s.selectedLayerId)
  const updateLayer = useStore((s) => s.updateLayer)

  const selected = layers.find((l) => l.id === selectedLayerId)

  if (!selected) {
    return (
      <div className={styles.empty}>
        <span>Valj ett lager for att valja animation</span>
      </div>
    )
  }

  const isText = selected.type === 'text'

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <p className={styles.hint}>Animation for: <strong>{selected.name}</strong></p>
        <div className={styles.grid}>
          {ANIMATIONS.map((anim) => (
            <button
              key={anim.id}
              className={`${styles.animBtn} ${selected.animation === anim.id ? styles.active : ''}`}
              onClick={() => updateLayer(selected.id, { animation: anim.id })}
            >
              {anim.name}
            </button>
          ))}
        </div>
      </div>

      {isText && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Textedit</p>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label>Text</label>
              <textarea
                rows={3}
                value={selected.text}
                onChange={(e) => updateLayer(selected.id, { text: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Farg</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={selected.textColor} onChange={(e) => updateLayer(selected.id, { textColor: e.target.value })} style={{ width: 36, height: 36, padding: 2, flex: 'none', cursor: 'pointer' }} />
                <input type="text" value={selected.textColor} onChange={(e) => updateLayer(selected.id, { textColor: e.target.value })} style={{ fontFamily: 'monospace', fontSize: 12 }} />
              </div>
            </div>
            <div className={styles.field}>
              <label>Storlek ({selected.fontSize}px)</label>
              <input type="range" min={14} max={120} value={selected.fontSize} onChange={(e) => updateLayer(selected.id, { fontSize: Number(e.target.value) })} style={{ accentColor: 'var(--accent)', width: '100%', background: 'transparent', border: 'none', padding: 0 }} />
            </div>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Timing</p>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label>Starttid (s)</label>
            <input type="number" min={0} step={0.1} value={selected.startTime} onChange={(e) => updateLayer(selected.id, { startTime: Number(e.target.value) })} />
          </div>
          <div className={styles.field}>
            <label>Sluttid (s)</label>
            <input type="number" min={0} step={0.1} value={selected.endTime} onChange={(e) => updateLayer(selected.id, { endTime: Number(e.target.value) })} />
          </div>
          <div className={styles.field}>
            <label>Storlek ({selected.width}%)</label>
            <input type="range" min={5} max={100} value={selected.width} onChange={(e) => updateLayer(selected.id, { width: Number(e.target.value) })} style={{ accentColor: 'var(--accent)', width: '100%', background: 'transparent', border: 'none', padding: 0 }} />
          </div>
          <div className={styles.field}>
            <label>Opacitet ({Math.round(selected.opacity * 100)}%)</label>
            <input type="range" min={0} max={1} step={0.01} value={selected.opacity} onChange={(e) => updateLayer(selected.id, { opacity: Number(e.target.value) })} style={{ accentColor: 'var(--accent)', width: '100%', background: 'transparent', border: 'none', padding: 0 }} />
          </div>
        </div>
      </div>
    </div>
  )
}
