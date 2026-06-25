import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion'

export const GlowTitleSchema = {
  title: { label: 'Titel', type: 'text', default: 'GLOW' },
  tagline: { label: 'Tagline', type: 'text', default: 'Motion by JAmotion' },
  glowColor: { label: 'Glowfärg', type: 'color', default: '#7c6fff' },
  textColor: { label: 'Textfärg', type: 'color', default: '#ffffff' },
  bgColor: { label: 'Bakgrund', type: 'color', default: '#0a0a14' },
  fontSize: { label: 'Storlek', type: 'range', min: 60, max: 200, default: 140 },
}

export default function GlowTitle({ title = 'GLOW', tagline = 'Motion by JAmotion', glowColor = '#7c6fff', textColor = '#ffffff', bgColor = '#0a0a14', fontSize = 140 }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scaleIn = spring({ frame, fps, config: { damping: 18, stiffness: 60 } })
  const scale = interpolate(scaleIn, [0, 1], [0.6, 1])
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  const pulse = Math.sin(frame / 18) * 0.5 + 0.5
  const glowSize = interpolate(pulse, [0, 1], [40, 80])
  const glowOpacity = interpolate(pulse, [0, 1], [0.4, 0.8])

  const taglineOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const taglineY = interpolate(frame, [30, 50], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const letters = String(title).split('')

  return (
    <AbsoluteFill style={{ background: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            position: 'absolute',
            width: fontSize * letters.length * 0.65,
            height: fontSize * 1.2,
            background: glowColor,
            filter: `blur(${glowSize}px)`,
            opacity: glowOpacity,
            borderRadius: '50%',
          }}
        />
        <div style={{ display: 'flex', opacity, transform: `scale(${scale})` }}>
          {letters.map((letter, i) => {
            const delay = i * 4
            const letterSpring = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 80 } })
            const letterY = interpolate(letterSpring, [0, 1], [40, 0])
            return (
              <span
                key={i}
                style={{
                  color: textColor,
                  fontSize,
                  fontWeight: 900,
                  fontFamily: 'system-ui',
                  letterSpacing: '0.08em',
                  transform: `translateY(${letterY}px)`,
                  display: 'inline-block',
                  textShadow: `0 0 ${glowSize * 0.5}px ${glowColor}`,
                }}
              >
                {letter === ' ' ? ' ' : letter}
              </span>
            )
          })}
        </div>
      </div>

      <div style={{ opacity: taglineOpacity, transform: `translateY(${taglineY}px)` }}>
        <span style={{ color: glowColor, fontSize: 28, fontWeight: 300, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          {tagline}
        </span>
      </div>
    </AbsoluteFill>
  )
}
