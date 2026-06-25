import { registerRoot, Composition } from 'remotion'
import JAMotionComposition from './Composition'

function Root() {
  return (
    <Composition
      id="JAmotion"
      component={JAMotionComposition}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{
        layers: [],
        background: '#0f0f0f',
        backgroundType: 'color',
        gradient: null,
        backgroundImage: null,
        duration: 5,
      }}
    />
  )
}

registerRoot(Root)
