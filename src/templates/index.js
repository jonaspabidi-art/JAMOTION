import TextReveal, { TextRevealSchema } from './TextReveal'
import GlowTitle, { GlowTitleSchema } from './GlowTitle'
import LowerThird, { LowerThirdSchema } from './LowerThird'

export const TEMPLATES = [
  {
    id: 'text-reveal',
    name: 'Text Reveal',
    description: 'Ord animeras in ett i taget',
    component: TextReveal,
    schema: TextRevealSchema,
    durationInFrames: 120,
    fps: 30,
    width: 1080,
    height: 1080,
    defaultProps: Object.fromEntries(Object.entries(TextRevealSchema).map(([k, v]) => [k, v.default])),
  },
  {
    id: 'glow-title',
    name: 'Glow Title',
    description: 'Titel med pulserande gloweffekt',
    component: GlowTitle,
    schema: GlowTitleSchema,
    durationInFrames: 150,
    fps: 30,
    width: 1080,
    height: 1080,
    defaultProps: Object.fromEntries(Object.entries(GlowTitleSchema).map(([k, v]) => [k, v.default])),
  },
  {
    id: 'lower-third',
    name: 'Lower Third',
    description: 'Namnskylt som glider in',
    component: LowerThird,
    schema: LowerThirdSchema,
    durationInFrames: 120,
    fps: 30,
    width: 1920,
    height: 1080,
    defaultProps: Object.fromEntries(Object.entries(LowerThirdSchema).map(([k, v]) => [k, v.default])),
  },
]
