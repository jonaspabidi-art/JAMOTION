import { useState } from 'react'
import { TEMPLATES } from '../templates'
import styles from './TemplateGallery.module.css'

export default function TemplateGallery({ onSelect }) {
  const [hoverId, setHoverId] = useState(null)

  return (
    <div className={styles.gallery}>
      <p className={styles.hint}>Välj en mall — redigera sedan logo, text och färger</p>
      <div className={styles.grid}>
        {TEMPLATES.map((t) => {
          const Comp = t.component
          const isHover = hoverId === t.id
          return (
            <button
              key={t.id}
              className={styles.card}
              onClick={() => onSelect(t)}
              onMouseEnter={() => setHoverId(t.id)}
              onMouseLeave={() => setHoverId(null)}
            >
              <div className={styles.preview}>
                <Comp {...t.defaultProps} />
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{t.name}</span>
                <span className={styles.desc}>{t.description}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
