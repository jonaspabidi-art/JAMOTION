import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Img, staticFile } from 'remotion'
import { getAnimation } from '../animations'

function Layer({ layer }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const startFrame = Math.round(layer.startTime * fps)
  const localFrame = frame - startFrame
  const anim = getAnimation(layer.animation)

  if (localFrame < 0) return null

  const progress = spring({ frame: localFrame, fps, config: { damping: 20, stiffness: 80 } })

  const opacity = 'opacity' in (anim.initial ?? {})
    ? interpolate(progress, [0, 1], [anim.initial.opacity ?? 0, anim.animate?.opacity ?? 1])
    : layer.opacity

  const tx = 'x' in (anim.initial ?? {})
    ? interpolate(progress, [0, 1], [anim.initial.x, 0])
    : 0

  const ty = 'y' in (anim.initial ?? {})
    ? interpolate(progress, [0, 1], [anim.initial.y, 0])
    : 0

  const scale = 'scale' in (anim.initial ?? {})
    ? interpolate(progress, [0, 1], [anim.initial.scale, 1])
    : 1

  const rotate = 'rotate' in (anim.initial ?? {})
    ? interpolate(progress, [0, 1], [anim.initial.rotate, 0])
    : 0

  return (
    <div
      style={{
        position: 'absolute',
        left: `${layer.x}%`,
        top: `${layer.y}%`,
        width: `${layer.width}%`,
        opacity: opacity * (layer.opacity ?? 1),
        transform: `translate(-50%, -50%) translateX(${tx}px) translateY(${ty}px) scale(${scale}) rotate(${rotate}deg)`,
      }}
    >
      {layer.type === 'image' && layer.src && (
        <img src={layer.src} style={{ width: '100%', height: 'auto', display: 'block' }} />
      )}
      {layer.type === 'text' && (
        <span style={{
          fontSize: layer.fontSize,
          color: layer.textColor,
          fontWeight: layer.fontWeight ?? 700,
          fontFamily: 'system-ui, sans-serif',
          whiteSpace: 'pre-wrap',
          textAlign: 'center',
          lineHeight: 1.2,
          display: 'block',
        }}>
          {layer.text}
        </span>
      )}
    </div>
  )
}

export default function JAMotionComposition({ layers = [], background = '#0f0f0f', backgroundType = 'color', gradient, backgroundImage, duration = 5 }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const bgStyle =
    backgroundType === 'gradient' && gradient
      ? { background: `linear-gradient(${gradient.angle}deg, ${gradient.from}, ${gradient.to})` }
      : backgroundType === 'image' && backgroundImage
      ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { background }

  const visibleLayers = layers.filter((l) => {
    const startFrame = Math.round(l.startTime * fps)
    const endFrame = Math.round(l.endTime * fps)
    return frame >= startFrame && frame <= endFrame
  })

  return (
    <AbsoluteFill style={{ ...bgStyle, overflow: 'hidden' }}>
      {visibleLayers.map((layer) => (
        <Layer key={layer.id} layer={layer} />
      ))}
    </AbsoluteFill>
  )
}
