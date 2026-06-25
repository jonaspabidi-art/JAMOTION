import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion'

export const LowerThirdSchema = {
  name: { label: 'Namn', type: 'text', default: 'Jonas Abidi' },
  title: { label: 'Titel', type: 'text', default: 'Motion Designer' },
  accentColor: { label: 'Accentfärg', type: 'color', default: '#7c6fff' },
  textColor: { label: 'Textfärg', type: 'color', default: '#ffffff' },
  bgColor: { label: 'Bakgrund', type: 'color', default: '#0f0f0f' },
}

export default function LowerThird({ name = 'Jonas Abidi', title = 'Motion Designer', accentColor = '#7c6fff', textColor = '#ffffff', bgColor = '#0f0f0f' }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const slideIn = spring({ frame, fps, config: { damping: 20, stiffness: 80 } })
  const x = interpolate(slideIn, [0, 1], [-400, 0])

  const barProgress = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 18, stiffness: 100 } })
  const barHeight = interpolate(barProgress, [0, 1], [0, 80])

  const nameOpacity = interpolate(frame, [12, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const nameY = interpolate(frame, [12, 24], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const titleOpacity = interpolate(frame, [20, 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const titleY = interpolate(frame, [20, 32], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: bgColor }}>
      <div style={{
        position: 'absolute',
        bottom: 160,
        left: 80,
        transform: `translateX(${x}px)`,
        display: 'flex',
        alignItems: 'stretch',
        gap: 20,
      }}>
        <div style={{
          width: 5,
          height: barHeight,
          background: accentColor,
          borderRadius: 3,
          alignSelf: 'flex-end',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{
            color: textColor,
            fontSize: 52,
            fontWeight: 700,
            fontFamily: 'system-ui',
            letterSpacing: '-0.01em',
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
            display: 'block',
          }}>
            {name}
          </span>

          <span style={{
            color: accentColor,
            fontSize: 26,
            fontWeight: 400,
            fontFamily: 'system-ui',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            display: 'block',
          }}>
            {title}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  )
}
