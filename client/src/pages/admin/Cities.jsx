import { useState, useEffect } from 'react'
import api from '../../services/api'
import { getStates } from '../../services/locations'

export default function AdminCities() {
  const [cities, setCities]   = useState([])
  const [states, setStates]   = useState([])
  const [form, setForm]       = useState({ name: '', state_id: '' })
  const [editing, setEditing] = useState(null)
  const [filter, setFilter]   = useState('')
  const [error, setError]     = useState('')

  const load = () => {
    const url = filter ? `/admin/cities?state_id=${filter}` : '/admin/cities'
    api.get(url).then(({ data }) => setCities(data.cities))
  }

  useEffect(() => { getStates().then(({ data }) => setStates(data.states)) }, [])
  useEffect(() => { load() }, [filter])

  const handleSave = async () => {
    if (!form.name || !form.state_id) return setError('Nombre y estado son requeridos')
    setError('')
    try {
      if (editing) {
        await api.put(`/admin/cities/${editing.id}`, form)
        setEditing(null)
      } else {
        await api.post('/admin/cities', form)
      }
      setForm({ name: '', state_id: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.error || 'Error')
    }
  }

  const handleEdit = (c) => { setEditing(c); setForm({ name: c.name, state_id: c.state_id }) }
  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta ciudad?')) return
    await api.delete(`/admin/cities/${id}`)
    load()
  }

  return (
    <div>
      <h1 style={styles.h1}>Ciudades</h1>
      {error && <div className="error-msg">{error}</div>}

      <div style={styles.form}>
        <input className="input" placeholder="Nombre de ciudad" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ maxWidth: 200 }} />
        <select className="input" value={form.state_id}
          onChange={(e) => setForm({ ...form, state_id: e.target.value })} style={{ maxWidth: 200 }}>
          <option value="">— Estado —</option>
          {states.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>
          {editing ? 'Guardar' : '+ Agregar'}
        </button>
        {editing && (
          <button className="btn btn-secondary btn-sm"
            onClick={() => { setEditing(null); setForm({ name: '', state_id: '' }) }}>Cancelar</button>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 240 }}>
          <option value="">Todos los estados</option>
          {states.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>{['ID', 'Ciudad', 'Estado', 'Acciones'].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {cities.map((c) => (
            <tr key={c.id} style={styles.tr}>
              <td style={styles.td}>{c.id}</td>
              <td style={styles.td}>{c.name}</td>
              <td style={styles.td}>{c.state_name}</td>
              <td style={styles.td}>
                <button className="btn btn-secondary btn-sm" style={{ marginRight: 6 }} onClick={() => handleEdit(c)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Eliminar</button>
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
  form:  { display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow)' },
  th:    { padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' },
  tr:    { borderBottom: '1px solid var(--gray-100)' },
  td:    { padding: '12px 16px', fontSize: 14 },
}