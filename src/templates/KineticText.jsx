import { Stage, Sprite, useSprite, Easing, clamp } from '../engine'

export const KineticTextSchema = {
  line1: { label: 'Rad 1', type: 'text', default: 'PRODUKT' },
  line2: { label: 'Rad 2 (stor)', type: 'text', default: 'LANSERING' },
  line3: { label: 'Rad 3', type: 'text', default: '2026' },
  accentColor: { label: 'Accentfarg', type: 'color', default: '#FF5A1F' },
  textColor: { label: 'Textfarg', type: 'color', default: '#ffffff' },
  bgColor: { label: 'Bakgrund', type: 'color', default: '#1A1511' },
}

function KineticScene({ line1, line2, line3, accentColor, textColor }) {
  const { localTime } = useSprite()
  const words = [line1, line2, line3]

  return (
    <div style={{ position: 'absolute', inset: 0, padding: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
      {words.map((w, i) => {
        const t = clamp((localTime - 0.1 - i * 0.14) / 0.4, 0, 1)
        const e = Easing.easeOutBack(t)
        return (
          <div key={i} style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: i === 1 ? 160 : 120,
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            color: i === 1 ? accentColor : textColor,
            transform: `translateX(${(1 - e) * -140}px)`,
            opacity: t,
          }}>
            {w}
          </div>
        )
      })}
      <div style={{
        marginTop: 36,
        height: 10,
        width: `${clamp((localTime - 0.35) / 0.55, 0, 1) * 100}%`,
        background: accentColor,
        borderRadius: 5,
      }} />
    </div>
  )
}

export default function KineticText({ line1 = 'PRODUKT', line2 = 'LANSERING', line3 = '2026', accentColor = '#FF5A1F', textColor = '#ffffff', bgColor = '#1A1511' }) {
  return (
    <Stage width={1080} height={1080} duration={4} background={bgColor} loop>
      <Sprite start={0} end={4}>
        <KineticScene line1={line1} line2={line2} line3={line3} accentColor={accentColor} textColor={textColor} />
      </Sprite>
    </Stage>
  )
}
