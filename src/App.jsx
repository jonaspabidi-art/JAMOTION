import { useState } from 'react'
import Canvas from './components/Canvas'
import Timeline from './components/Timeline'
import LayersPanel from './components/LayersPanel'
import AnimationPanel from './components/AnimationPanel'
import BackgroundPanel from './components/BackgroundPanel'
import AudioPanel from './components/AudioPanel'
import TemplateGallery from './components/TemplateGallery'
import TemplateEditor from './components/TemplateEditor'
import { useStore } from './store'
import styles from './App.module.css'

const API = import.meta.env.PROD ? '' : 'http://localhost:3001'

const TABS = [
  { id: 'templates', label: 'Mallar',    icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z' },
  { id: 'layers',    label: 'Lager',     icon: 'M4 6h16M4 10h16M4 14h10' },
  { id: 'animation', label: 'Animation', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'background',label: 'Bakgrund',  icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'audio',     label: 'Ljud',      icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('templates')
  const [exporting, setExporting] = useState(false)
  const [activeTemplate, setActiveTemplate] = useState(null)
  const [templateProps, setTemplateProps] = useState({})

  const { layers, background, backgroundType, gradient, backgroundImage, duration } = useStore()

  function handleSelectTemplate(t) {
    setActiveTemplate(t)
    setTemplateProps(t.defaultProps)
  }

  function handleTemplatePropChange(key, value) {
    setTemplateProps((prev) => ({ ...prev, [key]: value }))
  }

  async function handleExport() {
    if (layers.length === 0 && !activeTemplate) return alert('Lägg till ett lager eller välj en mall först.')
    setExporting(true)
    try {
      const res = await fetch(`${API}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layers, background, backgroundType, gradient, backgroundImage, duration }),
      })
      if (!res.ok) throw new Error(await res.text())
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'jamotion-export.mp4'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Export misslyckades: ' + err.message)
    } finally {
      setExporting(false)
    }
  }

  const panelContent = (() => {
    if (activeTab === 'templates') {
      return activeTemplate
        ? <TemplateEditor template={activeTemplate} props={templateProps} onChange={handleTemplatePropChange} onBack={() => setActiveTemplate(null)} />
        : <TemplateGallery onSelect={handleSelectTemplate} />
    }
    if (activeTab === 'layers')     return <LayersPanel />
    if (activeTab === 'animation')  return <AnimationPanel />
    if (activeTab === 'background') return <BackgroundPanel />
    if (activeTab === 'audio')      return <AudioPanel />
    return null
  })()

  const TemplateComp = activeTemplate?.component

  return (
    <div className={styles.app}>
      {/* ── Top bar ── */}
      <header className={styles.header}>
        <span className={styles.logo}>JAmotion</span>
        <div className={styles.headerRight}>
          {activeTemplate && (
            <span className={styles.templateBadge}>{activeTemplate.name}</span>
          )}
          <button className={styles.exportBtn} onClick={handleExport} disabled={exporting}>
            {exporting
              ? <span className={styles.spinner} />
              : <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round"/><polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round"/><line x1={12} y1={15} x2={12} y2={3} strokeLinecap="round"/></svg>
            }
            {exporting ? 'Renderar...' : 'Exportera'}
          </button>
        </div>
      </header>

      {/* ── Body (canvas + sidebar) ── */}
      <div className={styles.body}>

        {/* Canvas area */}
        <div className={styles.canvasArea}>
          <div className={styles.canvasWrap}>
            {TemplateComp
              ? <TemplateComp {...templateProps} />
              : <Canvas />
            }
          </div>
          {!TemplateComp && <Timeline />}
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <svg width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          <div className={styles.panel}>
            {panelContent}
          </div>
        </aside>

      </div>
    </div>
  )
}
