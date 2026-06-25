import { useRef } from 'react'
import { useStore } from '../store'
import styles from './LayersPanel.module.css'

export default function LayersPanel() {
  const layers = useStore((s) => s.layers)
  const selectedLayerId = useStore((s) => s.selectedLayerId)
  const addLayer = useStore((s) => s.addLayer)
  const removeLayer = useStore((s) => s.removeLayer)
  const selectLayer = useStore((s) => s.selectLayer)
  const duration = useStore((s) => s.duration)

  const imgInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    addLayer({ type: 'image', name: file.name.replace(/\.[^.]+$/, ''), src: url, width: 50, endTime: duration })
    e.target.value = ''
  }

  return (
    <div className={styles.panel}>
      <div className={styles.addRow}>
        <button className={styles.addBtn} onClick={() => imgInputRef.current?.click()}>
          <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect x={3} y={3} width={18} height={18} rx={2} />
            <circle cx={8.5} cy={8.5} r={1.5} />
            <path d="m21 15-5-5L5 21" />
          </svg>
          Lagg till bild / logo
        </button>
        <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />

        <button className={styles.addBtn} onClick={() => addLayer({ type: 'text', name: 'Text', text: 'Din text', width: 60, endTime: duration })}>
          <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M4 7h16M4 12h10M4 17h7" strokeLinecap="round" />
          </svg>
          Lagg till text
        </button>
      </div>

      <div className={styles.list}>
        {layers.length === 0 && (
          <p className={styles.empty}>Inga lager annu</p>
        )}
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            className={`${styles.item} ${selectedLayerId === layer.id ? styles.active : ''}`}
            onClick={() => selectLayer(layer.id)}
          >
            <div className={styles.thumb}>
              {layer.type === 'image' && layer.src
                ? <img src={layer.src} alt="" />
                : <span style={{ fontSize: 18 }}>T</span>}
            </div>
            <div className={styles.meta}>
              <span className={styles.name}>{layer.name}</span>
              <span className={styles.timing}>{layer.startTime}s - {layer.endTime}s</span>
            </div>
            <button
              className={styles.removeBtn}
              onClick={(e) => { e.stopPropagation(); removeLayer(layer.id) }}
              title="Ta bort lager"
            >
              <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
