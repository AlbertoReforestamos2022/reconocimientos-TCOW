import { useEditorStore } from '../../store/editorStore'

export default function TextControl({ field, styleField, label }) {
  const template        = useEditorStore((s) => s.template)
  const setField        = useEditorStore((s) => s.setField)
  const setNestedField  = useEditorStore((s) => s.setNestedField)

  const value = template[field]
  const style = template[styleField] || {}

  return (
    <div>
      <div className="form-group">
        <label className="input-label">{label}</label>
        <textarea className="input" rows={3} value={value}
          onChange={(e) => setField(field, e.target.value)}
          style={{ resize: 'vertical', lineHeight: 1.4 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="form-group">
          <label className="input-label">Color</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="color" value={style.color || '#ffffff'}
              onChange={(e) => setNestedField(styleField, 'color', e.target.value)}
              style={{ width: 36, height: 36, padding: 2, border: '1px solid var(--gray-300)', borderRadius: 6, cursor: 'pointer' }} />
            <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{style.color}</span>
          </div>
        </div>
        <div className="form-group">
          <label className="input-label">Tamaño: {style.fontSize}px</label>
          <input type="range" min={12} max={72} value={style.fontSize || 18}
            onChange={(e) => setNestedField(styleField, 'fontSize', Number(e.target.value))}
            style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  )
}