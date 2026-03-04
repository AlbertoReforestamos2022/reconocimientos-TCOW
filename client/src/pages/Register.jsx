import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore }   from '../store/authStore'
import { useEditorStore } from '../store/editorStore'
import { register }       from '../services/auth'
import { getStates, getCitiesByState } from '../services/locations'

export default function Register() {
  const navigate     = useNavigate()
  const authLogin    = useAuthStore((s) => s.login)
  const initFromUser = useEditorStore((s) => s.initFromUser)

  const [form, setForm]     = useState({ username: '', email: '', password: '', state_id: '', city_id: '' })
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  // Cargar estados al montar
  useEffect(() => {
    getStates().then(({ data }) => setStates(data.states)).catch(() => {})
  }, [])

  // Cargar ciudades cuando cambia el estado
  useEffect(() => {
    if (!form.state_id) { setCities([]); return }
    getCitiesByState(form.state_id)
      .then(({ data }) => setCities(data.cities))
      .catch(() => setCities([]))
    setForm((f) => ({ ...f, city_id: '' }))
  }, [form.state_id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres')
    setLoading(true)
    try {
      const payload = {
        username: form.username,
        email:    form.email,
        password: form.password,
        city_id:  form.city_id || undefined,
      }
      const { data } = await register(payload)
      authLogin(data.token, data.user)
      initFromUser(data.user)
      navigate('/editor')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>Logo reforestamos </div>
        <h1 style={styles.title}>Crear cuenta</h1>
        <p style={styles.subtitle}>Únete al editor de branding</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Usuario</label>
            <input className="input" name="username" value={form.username}
              onChange={handleChange} placeholder="mi_usuario" required />
          </div>
          <div className="form-group">
            <label className="input-label">Correo electrónico</label>
            <input className="input" type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="tu@correo.com" required />
          </div>
          <div className="form-group">
            <label className="input-label">Contraseña</label>
            <input className="input" type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="Mínimo 8 caracteres" required />
          </div>

          {/* Cascada Estado → Ciudad */}
          <div className="form-group">
            <label className="input-label">Estado (opcional)</label>
            <select className="input" name="state_id" value={form.state_id} onChange={handleChange}>
              <option value="">— Selecciona un estado —</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="input-label">Ciudad (opcional)</label>
            <select className="input" name="city_id" value={form.city_id}
              onChange={handleChange} disabled={!form.state_id || cities.length === 0}>
              <option value="">— Selecciona una ciudad —</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p style={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--green)', fontWeight: 600 }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page:     { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: 16 },
  card:     { background: '#fff', borderRadius: 12, padding: '40px 36px', width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-md)' },
  logo:     { fontSize: 40, textAlign: 'center', marginBottom: 8 },
  title:    { fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'var(--gray-500)', textAlign: 'center', marginBottom: 28 },
  footer:   { marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--gray-500)' },
}