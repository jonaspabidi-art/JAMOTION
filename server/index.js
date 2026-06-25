import express from 'express'
import cors from 'cors'
import { renderMedia, selectComposition } from '@remotion/renderer'
import { bundle } from '@remotion/bundler'
import { createWriteStream, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json({ limit: '50mb' }))

mkdirSync(join(__dirname, 'tmp'), { recursive: true })

let bundled = null
async function getBundle() {
  if (!bundled) {
    console.log('Bundling Remotion composition...')
    bundled = await bundle({ entryPoint: join(__dirname, '../src/remotion/index.jsx') })
    console.log('Bundle ready.')
  }
  return bundled
}

app.use(express.static(join(__dirname, '../dist')))
app.get('/health', (_req, res) => res.json({ ok: true }))

app.post('/render', async (req, res) => {
  const { composition, layers, background, backgroundType, gradient, backgroundImage, duration, fps = 30 } = req.body

  if (!layers) {
    return res.status(400).json({ error: 'Missing layers' })
  }

  const outFile = join(__dirname, 'tmp', `${randomUUID()}.mp4`)

  try {
    const bundleLocation = await getBundle()

    const comp = await selectComposition({
      serveUrl: bundleLocation,
      id: 'JAmotion',
      inputProps: { layers, background, backgroundType, gradient, backgroundImage, duration },
    })

    await renderMedia({
      composition: comp,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outFile,
      inputProps: { layers, background, backgroundType, gradient, backgroundImage, duration },
      durationInFrames: Math.round(duration * fps),
      fps,
    })

    res.download(outFile, 'jamotion-export.mp4', (err) => {
      if (err) console.error('Download error:', err)
      import('fs').then(({ unlinkSync }) => { try { unlinkSync(outFile) } catch {} })
    })
  } catch (err) {
    console.error('Render error:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('*', (_req, res) => res.sendFile(join(__dirname, '../dist/index.html')))

app.listen(PORT, () => console.log(`JAmotion server running on port ${PORT}`))
