import KineticText, { KineticTextSchema } from './KineticText'
import StatCounter, { StatCounterSchema } from './StatCounter'
import SocialHandle, { SocialHandleSchema } from './SocialHandle'
import LogoReveal, { LogoRevealSchema } from './LogoReveal'

function defaults(schema) {
  return Object.fromEntries(Object.entries(schema).map(([k, v]) => [k, v.default]))
}

export const TEMPLATES = [
  {
    id: 'logo-reveal',
    name: 'Logo Reveal',
    description: 'Varumarke med pulserande CTA',
    component: LogoReveal,
    schema: LogoRevealSchema,
    duration: 5,
    defaultProps: defaults(LogoRevealSchema),
    previewGradient: 'linear-gradient(135deg, #FBF5EC 0%, #FFE5D6 100%)',
    previewAccent: '#FF5A1F',
    previewIcon: '▶ JA',
  },
  {
    id: 'kinetic-text',
    name: 'Kinetic Text',
    description: 'Tre rader slår in med kraft',
    component: KineticText,
    schema: KineticTextSchema,
    duration: 4,
    defaultProps: defaults(KineticTextSchema),
    previewGradient: 'linear-gradient(135deg, #1A1511 0%, #2d1f17 100%)',
    previewAccent: '#FF5A1F',
    previewIcon: 'PRODUKT\nLANSERING\n2026',
  },
  {
    id: 'stat-counter',
    name: 'Stat Counter',
    description: 'Siffra raeknar upp + staplar',
    component: StatCounter,
    schema: StatCounterSchema,
    duration: 4,
    defaultProps: defaults(StatCounterSchema),
    previewGradient: 'linear-gradient(135deg, #FFF1DA 0%, #FFE0B0 100%)',
    previewAccent: '#FF5A1F',
    previewIcon: '+248%',
  },
  {
    id: 'social-handle',
    name: 'Social Handle',
    description: 'Handle + CTA glider in',
    component: SocialHandle,
    schema: SocialHandleSchema,
    duration: 4,
    defaultProps: defaults(SocialHandleSchema),
    previewGradient: 'linear-gradient(135deg, #FBF5EC 0%, #E8E0D4 100%)',
    previewAccent: '#FF5A1F',
    previewIcon: '@jamotion',
  },
]
