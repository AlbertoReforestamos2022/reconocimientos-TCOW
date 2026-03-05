import { useEffect } from 'react'
import { useNavigate }    from 'react-router-dom'
import { useAuthStore }   from '../store/authStore'
import { useEditorStore } from '../store/editorStore'
import ControlPanel  from '../components/ControlPanel/ControlPanel'
import PreviewCanvas from '../components/Preview/PreviewCanvas'

export default function Editor() {
  const user         = useAuthStore((s) => s.user)
  const logout       = useAuthStore((s) => s.logout)
  const initFromUser = useEditorStore((s) => s.initFromUser)
  const navigate     = useNavigate()

  useEffect(() => { initFromUser(user) }, [user])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={styles.root}>
      {/* Navbar */}
      <header style={styles.navbar}>
        <span style={styles.brand}> Reconocimiento - Tree Cities of the world </span>
        <div style={styles.navRight}>
          {user?.role === 'admin' && (
            <button className="btn btn-secondary btn-sm"
              onClick={() => navigate('/admin')}>Panel Admin</button>
          )}
          <span style={styles.username}> {user?.username}</span>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Salir</button>
        </div>
      </header>

      {/* Contenido principal */}
      <main style={styles.main}>
        <div style={styles.panel}>
          <ControlPanel />
        </div>
        <div style={styles.preview}>
          <PreviewCanvas />
        </div>
      </main>
    </div>
  )
}

const styles = {
  root:     { display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' },
  navbar:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 56, background: '#fff', borderBottom: '1px solid var(--gray-200)', flexShrink: 0 },
  brand:    { fontWeight: 800, fontSize: 18 },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  username: { fontSize: 14, color: 'var(--gray-500)' },
  main:     { display: 'flex', flex: 1, overflow: 'hidden' },
  panel:    { width: 340, flexShrink: 0, overflowY: 'auto', background: '#fff', borderRight: '1px solid var(--gray-200)' },
  preview:  { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'var(--gray-100)', overflowY: 'auto' },
}