import { useRef } from 'react'
import { useStore } from '../store'
import { saveFile, deleteFile } from '../fileStore'
import styles from './AudioPanel.module.css'

export default function AudioPanel() {
  const audioSrc = useStore((s) => s.audioSrc)
  const audioName = useStore((s) => s.audioName)
  const audioVolume = useStore((s) => s.audioVolume)
  const audioKey = useStore((s) => s.audioKey)
  const setAudio = useStore((s) => s.setAudio)
  const setAudioVolume = useStore((s) => s.setAudioVolume)
  const removeAudio = useStore((s) => s.removeAudio)

  const inputRef = useRef(null)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const key = await saveFile(file)
    setAudio(URL.createObjectURL(file), file.name, key)
    e.target.value = ''
  }

  const handleRemove = () => {
    if (audioKey) deleteFile(audioKey)
    removeAudio()
  }

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Bakgrundsljud</p>

        {audioSrc ? (
          <div className={styles.track}>
            <div className={styles.trackIcon}>
              <svg width={20} height={20} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <div className={styles.trackInfo}>
              <span className={styles.trackName}>{audioName}</span>
              <span className={styles.trackSub}>Laddad</span>
            </div>
            <button className={styles.removeBtn} onClick={handleRemove} title="Ta bort ljud">
              <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : (
          <button className={styles.uploadBtn} onClick={() => inputRef.current?.click()}>
            <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" />
              <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
              <line x1={12} y1={3} x2={12} y2={15} strokeLinecap="round" />
            </svg>
            Ladda upp ljud (mp3, wav, m4a)
          </button>
        )}

        <input ref={inputRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleUpload} />
      </div>

      {audioSrc && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Volym ({Math.round(audioVolume * 100)}%)</p>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={audioVolume}
            onChange={(e) => setAudioVolume(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)', background: 'transparent', border: 'none', padding: 0 }}
          />
        </div>
      )}

      <div className={styles.tip}>
        <p>Ljudet spelas upp automatiskt nar du trycker pa play i tidslinjalen.</p>
      </div>
    </div>
  )
}
