import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const NAV = [
  { to: '/admin/states', label: '🗺 Estados' },
  { to: '/admin/cities', label: '🏙 Ciudades' },
  { to: '/admin/users',  label: '👥 Usuarios' },
]

export default function AdminLayout() {
  const logout   = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return (
    <div style={styles.root}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>⚙️ Panel Admin</div>
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} style={({ isActive }) => ({
              ...styles.navLink,
              background: isActive ? '#f0fdf4' : 'transparent',
              color:      isActive ? 'var(--green)' : 'var(--gray-700)',
              fontWeight: isActive ? 700 : 500,
            })}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: 16, borderTop: '1px solid var(--gray-200)' }}>
          <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginBottom: 8 }}
            onClick={() => navigate('/editor')}>← Ir al Editor</button>
          <button className="btn btn-danger btn-sm" style={{ width: '100%' }}
            onClick={() => { logout(); navigate('/login') }}>Cerrar sesión</button>
        </div>
      </aside>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

const styles = {
  root:    { display: 'flex', height: '100vh' },
  sidebar: { width: 220, flexShrink: 0, background: '#fff', borderRight: '1px solid var(--gray-200)', display: 'flex', flexDirection: 'column', padding: '0 0 16px' },
  brand:   { padding: '20px 16px', fontWeight: 800, fontSize: 16, borderBottom: '1px solid var(--gray-200)' },
  navLink: { display: 'block', padding: '10px 16px', fontSize: 14, borderRadius: 6, margin: '4px 8px', textDecoration: 'none', transition: 'all .15s' },
  main:    { flex: 1, overflowY: 'auto', padding: 32, background: 'var(--gray-50)' },
}