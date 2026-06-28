import { Stage, Sprite, useSprite, Easing, clamp } from '../engine'

export const LogoRevealSchema = {
  brandName: { label: 'Varumarke', type: 'text', default: 'JAMOTION' },
  tagline: { label: 'Tagline', type: 'text', default: 'automatiserad motion graphics' },
  cta: { label: 'CTA-knapp', type: 'text', default: 'Testa gratis' },
  logoSrc: { label: 'Logotyp URL (valfri)', type: 'text', default: '' },
  accentColor: { label: 'Accentfarg', type: 'color', default: '#FF5A1F' },
  bgColor: { label: 'Bakgrund', type: 'color', default: '#FBF5EC' },
  textColor: { label: 'Textfarg', type: 'color', default: '#1A1511' },
}

function LogoScene({ brandName, tagline, cta, logoSrc, accentColor, bgColor, textColor }) {
  const { localTime } = useSprite()

  const eWordmark = Easing.easeOutBack(clamp(localTime / 0.45, 0, 1))
  const eTagline = Easing.easeOutCubic(clamp((localTime - 0.5) / 0.4, 0, 1))
  const eBtn = Easing.easeOutBack(clamp((localTime - 0.85) / 0.5, 0, 1))
  const pulse = 1 + Math.sin(Math.max(0, localTime - 1.4) * 5) * 0.022

  const letters = brandName.toUpperCase().split('')

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
      {/* Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
        {logoSrc ? (
          <img src={logoSrc} alt="" style={{ width: 90, height: 90, objectFit: 'contain', transform: `scale(${eWordmark})`, opacity: eWordmark }} />
        ) : (
          <div style={{ width: 80, height: 80, borderRadius: 20, background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${eWordmark})` }}>
            <div style={{ width: 0, height: 0, borderTop: '18px solid transparent', borderBottom: '18px solid transparent', borderLeft: '30px solid #fff', marginLeft: 6 }} />
          </div>
        )}
        <div style={{ display: 'flex', overflow: 'hidden' }}>
          {letters.map((ch, i) => {
            const t = Easing.easeOutBack(clamp((localTime - 0.05 - i * 0.04) / 0.4, 0, 1))
            return (
              <span key={i} style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 130,
                fontWeight: 700,
                letterSpacing: '-0.04em',
                color: i < 2 ? textColor : accentColor,
                transform: `translateY(${(1 - t) * 40}px)`,
                opacity: t,
                display: 'inline-block',
                lineHeight: 1,
              }}>
                {ch === ' ' ? ' ' : ch}
              </span>
            )
          })}
        </div>
      </div>

      {/* Tagline */}
      <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 30, letterSpacing: '0.12em', color: textColor + '88', opacity: eTagline, textTransform: 'uppercase', marginBottom: 60, transform: `translateY(${(1 - eTagline) * 12}px)` }}>
        {tagline}
      </div>

      {/* CTA */}
      <div style={{ transform: `scale(${eBtn * pulse})`, opacity: clamp(eBtn, 0, 1), background: accentColor, borderRadius: 28, padding: '36px 80px', boxShadow: `0 20px 50px ${accentColor}66` }}>
        <span style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 60, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
          {cta} &#x2192;
        </span>
      </div>
    </div>
  )
}

export default function LogoReveal({ brandName = 'JAMOTION', tagline = 'automatiserad motion graphics', cta = 'Testa gratis', logoSrc = '', accentColor = '#FF5A1F', bgColor = '#FBF5EC', textColor = '#1A1511' }) {
  return (
    <Stage width={1080} height={1080} duration={5} background={bgColor} loop>
      <Sprite start={0} end={5}>
        <LogoScene brandName={brandName} tagline={tagline} cta={cta} logoSrc={logoSrc} accentColor={accentColor} bgColor={bgColor} textColor={textColor} />
      </Sprite>
    </Stage>
  )
}
