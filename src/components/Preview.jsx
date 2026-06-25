import { useRef } from 'react'
import { Player } from '@remotion/player'
import styles from './Preview.module.css'

export default function Preview({ template, props }) {
  const playerRef = useRef(null)

  if (!template) {
    return (
      <div className={styles.empty}>
        <span>Välj en mall för att börja</span>
      </div>
    )
  }

  const aspectRatio = template.width / template.height

  return (
    <div className={styles.wrapper}>
      <div className={styles.stage}>
        <div className={styles.playerWrap} style={{ aspectRatio }}>
          <Player
            ref={playerRef}
            component={template.component}
            durationInFrames={template.durationInFrames}
            fps={template.fps}
            compositionWidth={template.width}
            compositionHeight={template.height}
            inputProps={props}
            style={{ width: '100%', height: '100%' }}
            controls
            loop
            autoPlay
          />
        </div>
      </div>

      <div className={styles.meta}>
        <span className={styles.label}>{template.name}</span>
        <span className={styles.dim}>{template.width} x {template.height} · {template.fps}fps · {(template.durationInFrames / template.fps).toFixed(1)}s</span>
      </div>
    </div>
  )
}
