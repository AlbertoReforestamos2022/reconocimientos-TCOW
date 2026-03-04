import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function AdminStates() {
  const [states, setStates]   = useState([])
  const [name, setName]       = useState('')
  const [editing, setEditing] = useState(null)
  const [error, setError]     = useState('')

  const load = () => api.get('/admin/states').then(({ data }) => setStates(data.states))
  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!name.trim()) return
    setError('')
    try {
      if (editing) {
        await api.put(`/admin/states/${editing.id}`, { name })
        setEditing(null)
      } else {
        await api.post('/admin/states', { name })
      }
      setName('')
      load()
    } catch (err) {
      setError(err.response?.data?.error || 'Error')
    }
  }

  const handleEdit = (s) => { setEditing(s); setName(s.name) }
  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este estado y todas sus ciudades?')) return
    await api.delete(`/admin/states/${id}`)
    load()
  }

  return (
    <div>
      <h1 style={styles.h1}>Estados</h1>
      {error && <div className="error-msg">{error}</div>}

      <div style={styles.form}>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del estado" style={{ maxWidth: 300 }} />
        <button className="btn btn-primary btn-sm" onClick={handleSave}>
          {editing ? 'Guardar cambios' : '+ Agregar'}
        </button>
        {editing && (
          <button className="btn btn-secondary btn-sm"
            onClick={() => { setEditing(null); setName('') }}>Cancelar</button>
        )}
      </div>

      <table style={styles.table}>
        <thead>
          <tr>{['ID', 'Estado', 'Ciudades', 'Acciones'].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {states.map((s) => (
            <tr key={s.id} style={styles.tr}>
              <td style={styles.td}>{s.id}</td>
              <td style={styles.td}>{s.name}</td>
              <td style={styles.td}>{s.city_count}</td>
              <td style={styles.td}>
                <button className="btn btn-secondary btn-sm" style={{ marginRight: 6 }} onClick={() => handleEdit(s)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  h1:    { fontSize: 22, fontWeight: 800, marginBottom: 20 },
  form:  { display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow)' },
  th:    { padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' },
  tr:    { borderBottom: '1px solid var(--gray-100)' },
  td:    { padding: '12px 16px', fontSize: 14 },
}