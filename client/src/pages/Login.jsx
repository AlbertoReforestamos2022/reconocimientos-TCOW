import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEditorStore } from '../store/editorStore'
import { login } from '../services/auth'

export default function Login() {
  const navigate       = useNavigate()
  const authLogin      = useAuthStore((s) => s.login)
  const initFromUser   = useEditorStore((s) => s.initFromUser)
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await login(form)
      authLogin(data.token, data.user)
      initFromUser(data.user)
      navigate(data.user.role === 'admin' ? '/admin' : '/editor')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}> Logo Reforestamos</div>
        <h1 style={styles.title}>Branding Editor</h1>
        <p style={styles.subtitle}>Inicia sesión para continuar</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Correo electrónico</label>
            <input
              className="input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="input-label">Contraseña</label>
            <input
              className="input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={styles.footer}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ color: 'var(--green)', fontWeight: 600 }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page:     { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: 16 },
  card:     { background: '#fff', borderRadius: 12, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-md)' },
  logo:     { fontSize: 40, textAlign: 'center', marginBottom: 8 },
  title:    { fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'var(--gray-500)', textAlign: 'center', marginBottom: 28 },
  footer:   { marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--gray-500)' },
}