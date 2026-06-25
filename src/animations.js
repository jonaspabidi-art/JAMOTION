export const ANIMATIONS = [
  {
    id: 'none',
    name: 'Ingen',
    initial: {},
    animate: {},
    transition: {},
  },
  {
    id: 'fade-in',
    name: 'Tona in',
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  {
    id: 'slide-up',
    name: 'Glid upp',
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  {
    id: 'slide-left',
    name: 'Fran vanster',
    initial: { opacity: 0, x: -80 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  {
    id: 'slide-right',
    name: 'Fran hoger',
    initial: { opacity: 0, x: 80 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  {
    id: 'scale-in',
    name: 'Zooma in',
    initial: { opacity: 0, scale: 0.4 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  },
  {
    id: 'bounce',
    name: 'Studsa',
    initial: { opacity: 0, scale: 0.2 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring', damping: 8, stiffness: 200 },
  },
  {
    id: 'rotate-in',
    name: 'Rotera in',
    initial: { opacity: 0, rotate: -20, scale: 0.8 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  },
  {
    id: 'drop',
    name: 'Faller ner',
    initial: { opacity: 0, y: -80 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring', damping: 14, stiffness: 150 },
  },
  {
    id: 'flip',
    name: 'Flippa',
    initial: { opacity: 0, rotateX: 90 },
    animate: { opacity: 1, rotateX: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },
]

export function getAnimation(id) {
  return ANIMATIONS.find((a) => a.id === id) ?? ANIMATIONS[1]
}
