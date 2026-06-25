import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion'

export const TextRevealSchema = {
  text: { label: 'Text', type: 'textarea', default: 'Din text här' },
  subtext: { label: 'Undertext', type: 'text', default: 'undertitel' },
  textColor: { label: 'Textfärg', type: 'color', default: '#ffffff' },
  accentColor: { label: 'Accentfärg', type: 'color', default: '#7c6fff' },
  bgColor: { label: 'Bakgrund', type: 'color', default: '#0f0f0f' },
  fontSize: { label: 'Storlek', type: 'range', min: 40, max: 120, default: 80 },
}

export default function TextReveal({ text = 'Din text här', subtext = 'undertitel', textColor = '#ffffff', accentColor = '#7c6fff', bgColor = '#0f0f0f', fontSize = 80 }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const words = String(text).split(' ')

  const lineProgress = spring({ frame, fps, config: { damping: 20, stiffness: 80 }, delay: 0 })
  const lineWidth = interpolate(lineProgress, [0, 1], [0, 180])

  const subtextOpacity = interpolate(frame, [words.length * 6 + 10, words.length * 6 + 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em', justifyContent: 'center', padding: '0 60px' }}>
        {words.map((word, i) => {
          const delay = i * 5
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const y = interpolate(frame, [delay, delay + 12], [30, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          return (
            <span
              key={i}
              style={{
                color: textColor,
                opacity,
                transform: `translateY(${y}px)`,
                fontSize,
                fontWeight: 700,
                fontFamily: 'system-ui',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {word}
            </span>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: subtextOpacity }}>
        <div style={{ width: lineWidth, height: 2, background: accentColor, borderRadius: 1 }} />
        <span style={{ color: accentColor, fontSize: 28, fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {subtext}
        </span>
      </div>
    </AbsoluteFill>
  )
}
