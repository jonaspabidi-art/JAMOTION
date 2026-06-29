import { TEMPLATES } from '../templates'
import styles from './TemplateGallery.module.css'

export default function TemplateGallery({ onSelect }) {
  return (
    <div className={styles.gallery}>
      <p className={styles.hint}>Valj en mall - raedigera sedan text, logo och faerger</p>
      <div className={styles.grid}>
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            className={styles.card}
            onClick={() => onSelect(t)}
          >
            <div
              className={styles.preview}
              style={{ background: t.previewGradient }}
            >
              <span
                className={styles.previewText}
                style={{ color: t.previewAccent }}
              >
                {t.previewIcon}
              </span>
              <div className={styles.playBadge}>
                <svg width={12} height={12} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
                Vaelj
              </div>
            </div>
            <div className={styles.info}>
              <span className={styles.name}>{t.name}</span>
              <span className={styles.desc}>{t.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
