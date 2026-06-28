import { Stage, Sprite, useSprite, Easing, clamp, interpolate } from '../engine'

export const StatCounterSchema = {
  label: { label: 'Etikett', type: 'text', default: 'RÄCKVIDD' },
  value: { label: 'Värde (siffra)', type: 'text', default: '248' },
  suffix: { label: 'Suffix', type: 'text', default: '%' },
  prefix: { label: 'Prefix', type: 'text', default: '+' },
  accentColor: { label: 'Accentfarg', type: 'color', default: '#FF5A1F' },
  bgColor: { label: 'Bakgrund', type: 'color', default: '#FFF1DA' },
  textColor: { label: 'Textfarg', type: 'color', default: '#1A1511' },
}

function StatScene({ label, value, suffix, prefix, accentColor, bgColor, textColor }) {
  const { localTime } = useSprite()
  const target = parseFloat(value) || 0
  const val = Math.round(interpolate([0.1, 1.1], [0, target], Easing.easeOutCubic)(localTime))
  const barH = clamp((localTime - 0.15) / 0.8, 0, 1)
  const bars = [0.42, 0.6, 0.5, 0.78, 1.0]

  return (
    <div style={{ position: 'absolute', inset: 0, background: bgColor, padding: 80, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 32, color: textColor + '99', letterSpacing: '0.1em' }}>{label}</div>
      <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 220, fontWeight: 700, color: textColor, lineHeight: 1, letterSpacing: '-0.04em' }}>
        {prefix}{val}<span style={{ color: accentColor }}>{suffix}</span>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', gap: 24, height: 280 }}>
        {bars.map((b, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${b * barH * 100}%`,
            background: i === 4 ? accentColor : textColor,
            borderRadius: '10px 10px 0 0',
            transition: 'height 0.1s',
          }} />
        ))}
      </div>
    </div>
  )
}

export default function StatCounter({ label = 'RÄCKVIDD', value = '248', suffix = '%', prefix = '+', accentColor = '#FF5A1F', bgColor = '#FFF1DA', textColor = '#1A1511' }) {
  return (
    <Stage width={1080} height={1080} duration={4} background={bgColor} loop>
      <Sprite start={0} end={4}>
        <StatScene label={label} value={value} suffix={suffix} prefix={prefix} accentColor={accentColor} bgColor={bgColor} textColor={textColor} />
      </Sprite>
    </Stage>
  )
}
