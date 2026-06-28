import { Stage, Sprite, useSprite, Easing, clamp } from '../engine'

export const SocialHandleSchema = {
  handle: { label: 'Handle / Namn', type: 'text', default: '@jamotion' },
  cta: { label: 'CTA-text', type: 'text', default: 'Följ för mer' },
  logoSrc: { label: 'Logotyp URL', type: 'text', default: '' },
  accentColor: { label: 'Accentfarg', type: 'color', default: '#FF5A1F' },
  bgColor: { label: 'Bakgrund', type: 'color', default: '#FBF5EC' },
  textColor: { label: 'Textfarg', type: 'color', default: '#ffffff' },
}

function SocialScene({ handle, cta, logoSrc, accentColor, textColor }) {
  const { localTime } = useSprite()
  const slide = Easing.easeOutCubic(clamp(localTime / 0.45, 0, 1))
  const ctaSlide = Easing.easeOutBack(clamp((localTime - 0.3) / 0.4, 0, 1))

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 80 }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ transform: `translateX(${(1 - slide) * -160}px)`, opacity: slide }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 20, background: '#1A1511', borderRadius: 20, padding: '22px 34px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: accentColor, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {logoSrc
                ? <img src={logoSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 28, color: '#fff', fontWeight: 700 }}>{handle[1] || 'J'}</span>
              }
            </div>
            <span style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 58, fontWeight: 700, color: textColor, letterSpacing: '-0.02em' }}>
              {handle}
            </span>
          </div>
        </div>

        <div style={{ transform: `translateX(${(1 - ctaSlide) * -120}px) scale(${0.8 + 0.2 * ctaSlide})`, opacity: ctaSlide }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: accentColor, borderRadius: 16, padding: '18px 30px' }}>
            <span style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 46, fontWeight: 600, color: '#fff' }}>{cta}</span>
            <span style={{ fontSize: 42, color: '#fff' }}>&#x2197;</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SocialHandle({ handle = '@jamotion', cta = 'Följ för mer', logoSrc = '', accentColor = '#FF5A1F', bgColor = '#FBF5EC', textColor = '#ffffff' }) {
  return (
    <Stage width={1080} height={1080} duration={4} background={bgColor} loop>
      <Sprite start={0} end={4}>
        <SocialScene handle={handle} cta={cta} logoSrc={logoSrc} accentColor={accentColor} textColor={textColor} />
      </Sprite>
    </Stage>
  )
}
