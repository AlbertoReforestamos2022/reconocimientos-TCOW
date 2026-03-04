import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])

  const load = () => api.get('/admin/users').then(({ data }) => setUsers(data.users))
  useEffect(() => { load() }, [])

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    await api.put(`/admin/users/${user.id}/role`, { role: newRole })
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este usuario y todos sus proyectos?')) return
    await api.delete(`/admin/users/${id}`)
    load()
  }

  return (
    <div>
      <h1 style={styles.h1}>Usuarios ({users.length})</h1>
      <table style={styles.table}>
        <thead>
          <tr>{['ID', 'Usuario', 'Email', 'Ciudad', 'Rol', 'Proyectos', 'Registro', 'Acciones'].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={styles.tr}>
              <td style={styles.td}>{u.id}</td>
              <td style={styles.td}>{u.username}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>{u.city_name || '—'}</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, background: u.role === 'admin' ? '#dcfce7' : 'var(--gray-100)', color: u.role === 'admin' ? 'var(--green-dark)' : 'var(--gray-600)' }}>
                  {u.role}
                </span>
              </td>
              <td style={styles.td}>{u.project_count}</td>
              <td style={styles.td}>{new Date(u.created_at).toLocaleDateString('es-MX')}</td>
              <td style={styles.td}>
                <button className="btn btn-secondary btn-sm" style={{ marginRight: 6 }}
                  onClick={() => handleRoleToggle(u)}>
                  {u.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Eliminar</button>
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
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow)', fontSize: 13 },
  th:    { padding: '12px 16px', textAlign: 'left', fontWeight: 600, background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' },
  tr:    { borderBottom: '1px solid var(--gray-100)' },
  td:    { padding: '11px 16px' },
  badge: { padding: '3px 10px', borderRadius: 20, fontWeight: 600, fontSize: 12 },
}