import styles from './Editor.module.css'

export default function Editor({ template, props, onChange }) {
  if (!template) {
    return (
      <div className={styles.empty}>
        <span>Välj en mall för att redigera</span>
      </div>
    )
  }

  const schema = template.schema

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{template.name}</h3>
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
        const defaults = Object.fromEntries(Object.entries(schema).map(([k, v]) => [k, v.default]))
        Object.entries(defaults).forEach(([k, v]) => onChange(k, v))
      }}>
        Aterstall standard
      </button>
    </div>
  )
}

function renderField(key, field, value, onChange) {
  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          value={value ?? field.default}
          onChange={(e) => onChange(key, e.target.value)}
        />
      )

    case 'textarea':
      return (
        <textarea
          rows={3}
          value={value ?? field.default}
          onChange={(e) => onChange(key, e.target.value)}
          style={{ resize: 'vertical' }}
        />
      )

    case 'color':
      return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="color"
            value={value ?? field.default}
            onChange={(e) => onChange(key, e.target.value)}
            style={{ width: 36, height: 36, padding: 2, cursor: 'pointer', flex: 'none' }}
          />
          <input
            type="text"
            value={value ?? field.default}
            onChange={(e) => onChange(key, e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: 12 }}
          />
        </div>
      )

    case 'range':
      return (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="range"
            min={field.min}
            max={field.max}
            value={value ?? field.default}
            onChange={(e) => onChange(key, Number(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--accent)', padding: 0, background: 'transparent', border: 'none' }}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: 12, minWidth: 28, textAlign: 'right' }}>
            {value ?? field.default}
          </span>
        </div>
      )

    default:
      return null
  }
}
