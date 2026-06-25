import { Player } from '@remotion/player'
import { TEMPLATES } from '../templates'
import styles from './TemplateSelector.module.css'

export default function TemplateSelector({ selectedId, onSelect }) {
  return (
    <div className={styles.grid}>
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          className={`${styles.card} ${selectedId === t.id ? styles.active : ''}`}
          onClick={() => onSelect(t)}
        >
          <div className={styles.preview}>
            <Player
              component={t.component}
              durationInFrames={t.durationInFrames}
              fps={t.fps}
              compositionWidth={t.width}
              compositionHeight={t.height}
              inputProps={t.defaultProps}
              style={{ width: '100%', height: '100%' }}
              loop
              autoPlay
            />
          </div>
          <div className={styles.info}>
            <span className={styles.name}>{t.name}</span>
            <span className={styles.desc}>{t.description}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
