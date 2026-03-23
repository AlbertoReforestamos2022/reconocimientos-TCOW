const express = require('express')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const pool    = require('../db/connection')
const auth    = require('../middleware/auth')

const router = express.Router()

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  return res.status(403).json({ error: 'El registro de usuarios está deshabilitado. Solo existe un perfil de administrador.' })
  /*
  const { username, email, password, city_id } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email y password son requeridos' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'El email no tiene un formato válido' })
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    )
    if (existing.length > 0) {
      return res.status(409).json({ error: 'El email o username ya están registrados' })
    }

    if (city_id) {
      const [city] = await pool.query('SELECT id FROM cities WHERE id = ?', [city_id])
      if (city.length === 0) {
        return res.status(400).json({ error: 'La ciudad proporcionada no existe' })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, city_id) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, city_id || null]
    )

    const [userRows] = await pool.query(`
      SELECT u.id, u.username, u.email, u.role, u.city_id,
             c.name AS city_name, s.name AS state_name
      FROM users u
      LEFT JOIN cities c ON u.city_id = c.id
      LEFT JOIN states s ON c.state_id = s.id
      WHERE u.id = ?
    `, [result.insertId])

    const user  = userRows[0]
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role, city_id: user.city_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id        : user.id,
        username  : user.username,
        email     : user.email,
        role      : user.role,
        city_id   : user.city_id,
        city_name : user.city_name,
        state_name: user.state_name,
      }
    })
  } catch (err) {
    console.error('Error en register:', err)
    res.status(500).json({ error: 'Error al registrar usuario' })
  }
  */
})

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son requeridos' })
  }

  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.username, u.email, u.password, u.role, u.city_id,
             c.name AS city_name, s.name AS state_name
      FROM users u
      LEFT JOIN cities c ON u.city_id = c.id
      LEFT JOIN states s ON c.state_id = s.id
      WHERE u.email = ?
    `, [email])

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const user            = rows[0]
    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role, city_id: user.city_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id        : user.id,
        username  : user.username,
        email     : user.email,
        role      : user.role,
        city_id   : user.city_id,
        city_name : user.city_name,
        state_name: user.state_name,
      }
    })
  } catch (err) {
    console.error('Error en login:', err)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
})

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.username, u.email, u.role, u.city_id,
             c.name AS city_name, s.name AS state_name
      FROM users u
      LEFT JOIN cities c ON u.city_id = c.id
      LEFT JOIN states s ON c.state_id = s.id
      WHERE u.id = ?
    `, [req.user.id])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({ user: rows[0] })
  } catch (err) {
    console.error('Error en /me:', err)
    res.status(500).json({ error: 'Error al obtener datos del usuario' })
  }
})

module.exports = router
