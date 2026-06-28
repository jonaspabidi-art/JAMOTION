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
    description: 'Varumarke med pulserende CTA',
    component: LogoReveal,
    schema: LogoRevealSchema,
    duration: 5,
    defaultProps: defaults(LogoRevealSchema),
  },
  {
    id: 'kinetic-text',
    name: 'Kinetic Text',
    description: 'Tre rader slår in med kraft',
    component: KineticText,
    schema: KineticTextSchema,
    duration: 4,
    defaultProps: defaults(KineticTextSchema),
  },
  {
    id: 'stat-counter',
    name: 'Stat Counter',
    description: 'Siffra räknar upp + stapeldiagram',
    component: StatCounter,
    schema: StatCounterSchema,
    duration: 4,
    defaultProps: defaults(StatCounterSchema),
  },
  {
    id: 'social-handle',
    name: 'Social Handle',
    description: 'Handle + CTA glider in',
    component: SocialHandle,
    schema: SocialHandleSchema,
    duration: 4,
    defaultProps: defaults(SocialHandleSchema),
  },
]
