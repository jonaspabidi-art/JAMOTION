import { useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { getAnimation } from '../animations'
import styles from './Canvas.module.css'

export default function Canvas() {
  const layers = useStore((s) => s.layers)
  const selectedLayerId = useStore((s) => s.selectedLayerId)
  const background = useStore((s) => s.background)
  const backgroundType = useStore((s) => s.backgroundType)
  const backgroundImage = useStore((s) => s.backgroundImage)
  const gradient = useStore((s) => s.gradient)
  const currentTime = useStore((s) => s.currentTime)
  const selectLayer = useStore((s) => s.selectLayer)
  const updateLayer = useStore((s) => s.updateLayer)

  const dragState = useRef(null)
  const canvasRef = useRef(null)

  const visibleLayers = layers.filter(
    (l) => currentTime >= l.startTime && currentTime <= l.endTime
  )

  const bgStyle =
    backgroundType === 'gradient'
      ? { background: `linear-gradient(${gradient.angle}deg, ${gradient.from}, ${gradient.to})` }
      : backgroundType === 'image' && backgroundImage
      ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { background }

  const onLayerPointerDown = useCallback((e, layer) => {
    e.stopPropagation()
    selectLayer(layer.id)

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    dragState.current = {
      layerId: layer.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: layer.x,
      origY: layer.y,
      canvasW: rect.width,
      canvasH: rect.height,
    }

    const onMove = (ev) => {
      const d = dragState.current
      if (!d) return
      const dx = ((ev.clientX - d.startX) / d.canvasW) * 100
      const dy = ((ev.clientY - d.startY) / d.canvasH) * 100
      updateLayer(d.layerId, { x: Math.max(0, Math.min(100, d.origX + dx)), y: Math.max(0, Math.min(100, d.origY + dy)) })
    }

    const onUp = () => {
      dragState.current = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [selectLayer, updateLayer])

  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      style={bgStyle}
      onClick={() => selectLayer(null)}
    >
      <AnimatePresence mode="popLayout">
        {visibleLayers.map((layer) => {
          const anim = getAnimation(layer.animation)
          const isSelected = selectedLayerId === layer.id

          return (
            <motion.div
              key={layer.id}
              className={`${styles.layer} ${isSelected ? styles.selected : ''}`}
              style={{
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                width: `${layer.width}%`,
                opacity: layer.opacity,
              }}
              initial={anim.initial}
              animate={anim.animate}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={anim.transition}
              onPointerDown={(e) => onLayerPointerDown(e, layer)}
            >
              {layer.type === 'image' && layer.src && (
                <img src={layer.src} alt={layer.name} className={styles.layerImg} draggable={false} />
              )}
              {layer.type === 'text' && (
                <span
                  className={styles.layerText}
                  style={{
                    fontSize: layer.fontSize,
                    color: layer.textColor,
                    fontWeight: layer.fontWeight,
                  }}
                >
                  {layer.text}
                </span>
              )}
              {isSelected && (
                <div className={styles.selectRing} />
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>

      {layers.length === 0 && (
        <div className={styles.emptyHint}>
          <span>Lagg till ett lager for att borja</span>
        </div>
      )}
    </div>
  )
}
