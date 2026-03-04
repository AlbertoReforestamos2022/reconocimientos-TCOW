import { useEditorStore } from '../../store/editorStore'

export default function OverlayControl() {
  const overlay        = useEditorStore((s) => s.template.overlay)
  const setNestedField = useEditorStore((s) => s.setNestedField)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="form-group">
          <label className="input-label">Color del overlay</label>
          <input type="color" value={overlay.color}
            onChange={(e) => setNestedField('overlay', 'color', e.target.value)}
            style={{ width: '100%', height: 40, borderRadius: 6, border: '1px solid var(--gray-300)', cursor: 'pointer' }} />
        </div>
        <div className="form-group">
          <label className="input-label">Opacidad: {Math.round(overlay.opacity * 100)}%</label>
          <input type="range" min={0} max={100}
            value={Math.round(overlay.opacity * 100)}
            onChange={(e) => setNestedField('overlay', 'opacity', e.target.value / 100)}
            style={{ width: '100%', marginTop: 10 }} />
        </div>
      </div>
    </div>
  )
}