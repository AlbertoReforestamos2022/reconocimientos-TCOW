import { useState } from 'react'
import { useEditorStore } from '../../store/editorStore'
import { useExport }      from '../../hooks/useExport'
import { saveProject, updateProject } from '../../services/projects'

export default function DownloadControl({ projectId, setProjectId }) {
  const template       = useEditorStore((s) => s.template)
  const { exportImage } = useExport()
  const [format, setFormat]   = useState('png')
  const [name, setName]       = useState('mi-branding')
  const [saving, setSaving]   = useState(false)
  const [message, setMessage] = useState('')

  const handleExport = () => exportImage('preview-canvas', format, name)

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      if (projectId) {
        await updateProject(projectId, { name, canvas_json: template })
      } else {
        const { data } = await saveProject({ name, canvas_json: template })
        setProjectId(data.project.id)
      }
      setMessage('¡Proyecto guardado!')
    } catch {
      setMessage('Error al guardar')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="form-group">
        <label className="input-label">Nombre del archivo</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="input-label">Formato</label>
        <select className="input" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
        </select>
      </div>
      <button className="btn btn-primary" onClick={handleExport}>⬇ Descargar imagen</button>
      <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar proyecto'}
      </button>
      {message && <p style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>{message}</p>}
    </div>
  )
}