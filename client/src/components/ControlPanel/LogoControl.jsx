import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useEditorStore } from '../../store/editorStore'

const POSITIONS = [
  { value: 'top-left',      label: '↖ Sup. Izq.' },
  { value: 'top-right',     label: '↗ Sup. Der.' },
  { value: 'bottom-left',   label: '↙ Inf. Izq.' },
  { value: 'bottom-right',  label: '↘ Inf. Der.' },
  { value: 'center',        label: '⊕ Centro' },
]

export default function LogoControl() {
  const logo           = useEditorStore((s) => s.template.logo)
  const setNestedField = useEditorStore((s) => s.setNestedField)

  const onDrop = useCallback((files) => {
    const file = files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setNestedField('logo', 'src', e.target.result)
    reader.readAsDataURL(file)
  }, [setNestedField])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1,
  })

  return (
    <div>
      {/* Upload */}
      <div {...getRootProps()} style={{
        ...styles.dropzone,
        borderColor: isDragActive ? 'var(--green)' : 'var(--gray-300)',
      }}>
        <input {...getInputProps()} />
        {logo.src
          ? <img src={logo.src} alt="logo" style={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain' }} />
          : <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Arrastra el logo aquí</p>
        }
      </div>
      {logo.src && (
        <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginBottom: 12 }}
          onClick={() => setNestedField('logo', 'src', null)}>
          Quitar logo
        </button>
      )}

      {/* Posición */}
      <div className="form-group">
        <label className="input-label">Posición</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {POSITIONS.map((p) => (
            <button key={p.value} onClick={() => setNestedField('logo', 'position', p.value)}
              style={{
                padding: '7px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: logo.position === p.value ? 'var(--green)' : 'var(--gray-100)',
                color:      logo.position === p.value ? '#fff' : 'var(--gray-700)',
                border:     logo.position === p.value ? '2px solid var(--green)' : '2px solid transparent',
              }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tamaño */}
      <div className="form-group">
        <label className="input-label">Tamaño: {logo.size}px</label>
        <input type="range" min={40} max={300} value={logo.size}
          onChange={(e) => setNestedField('logo', 'size', Number(e.target.value))}
          style={{ width: '100%' }} />
      </div>
    </div>
  )
}

const styles = {
  dropzone: { border: '2px dashed', borderRadius: 8, padding: 16, textAlign: 'center', cursor: 'pointer', minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
}