import { useRef } from 'react'
import styles from './TemplateEditor.module.css'

export default function TemplateEditor({ template, props, onChange, onBack }) {
  const schema = template.schema

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Tillbaka
        </button>
        <span className={styles.name}>{template.name}</span>
      </div>

      <div className={styles.fields}>
        {Object.entries(schema).map(([key, field]) => (
          <div key={key} className={styles.field}>
            <label>{field.label}</label>
            {renderField(key, field, props[key], onChange)}
          </div>
        ))}
      </div>

      <button className={styles.resetBtn} onClick={() => {
        Object.entries(schema).forEach(([k, v]) => onChange(k, v.default))
      }}>
        Aterstall standard
      </button>
    </div>
  )
}

function renderField(key, field, value, onChange) {
  const val = value ?? field.default

  if (field.type === 'text') {
    return <input type="text" value={val} onChange={(e) => onChange(key, e.target.value)} />
  }

  if (field.type === 'color') {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="color" value={val} onChange={(e) => onChange(key, e.target.value)} style={{ width: 36, height: 36, padding: 2, flex: 'none', cursor: 'pointer', borderRadius: 6, border: '1px solid var(--border)' }} />
        <input type="text" value={val} onChange={(e) => onChange(key, e.target.value)} style={{ fontFamily: 'monospace', fontSize: 12 }} />
      </div>
    )
  }

  if (field.type === 'range') {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input type="range" min={field.min} max={field.max} value={val} onChange={(e) => onChange(key, Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--accent)', background: 'transparent', border: 'none', padding: 0 }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 12, minWidth: 28 }}>{val}</span>
      </div>
    )
  }

  return null
}
