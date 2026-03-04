import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useEditorStore } from '../../store/editorStore'

export default function BackgroundControl() {
  const setField = useEditorStore((s) => s.setField)
  const background = useEditorStore((s) => s.template.background)

  const onDrop = useCallback((files) => {
    const file = files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setField('background', e.target.result)
    reader.readAsDataURL(file)
  }, [setField])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  })

  return (
    <div>
      <div {...getRootProps()} style={{
        ...styles.dropzone,
        borderColor: isDragActive ? 'var(--green)' : 'var(--gray-300)',
        background:  isDragActive ? '#f0fdf4' : 'var(--gray-50)',
      }}>
        <input {...getInputProps()} />
        {background
          ? <img src={background} alt="preview" style={styles.preview} />
          : <p style={styles.hint}>
              {isDragActive ? '¡Suelta aquí!' : 'Arrastra una imagen o haz clic para elegir'}
            </p>
        }
      </div>
      {background && (
        <button className="btn btn-secondary btn-sm" style={{ marginTop: 8, width: '100%' }}
          onClick={() => setField('background', null)}>
          Quitar fondo
        </button>
      )}
    </div>
  )
}

const styles = {
  dropzone: { border: '2px dashed', borderRadius: 8, padding: 20, textAlign: 'center', cursor: 'pointer', transition: 'all .2s', minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  hint:     { fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5 },
  preview:  { width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 6 },
}