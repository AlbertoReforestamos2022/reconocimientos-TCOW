const express = require('express')
const pool    = require('../../db/connection')
const auth    = require('../../middleware/auth')
const isAdmin = require('../../middleware/isAdmin')

const router = express.Router()

router.use(auth, isAdmin)

// ─── GET /api/admin/states ───────────────────────────────────────────────────
router.get('/states', async (req, res) => {
  try {
    const [states] = await pool.query(`
      SELECT s.id, s.name,
             COUNT(c.id) AS city_count
      FROM states s
      LEFT JOIN cities c ON c.state_id = s.id
      GROUP BY s.id
      ORDER BY s.name ASC
    `)
    res.json({ states })
  } catch (err) {
    console.error('Error al obtener estados (admin):', err)
    res.status(500).json({ error: 'Error al obtener estados' })
  }
})

// ─── POST /api/admin/states ──────────────────────────────────────────────────
router.post('/states', async (req, res) => {
  const { name } = req.body
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre del estado es requerido' })
  }
  try {
    const [existing] = await pool.query(
      'SELECT id FROM states WHERE name = ?', [name.trim()]
    )
    if (existing.length > 0) {
      return res.status(409).json({ error: 'El estado ya existe' })
    }
    const [result] = await pool.query(
      'INSERT INTO states (name) VALUES (?)', [name.trim()]
    )
    res.status(201).json({
      message: 'Estado creado',
      state: { id: result.insertId, name: name.trim() }
    })
  } catch (err) {
    console.error('Error al crear estado:', err)
    res.status(500).json({ error: 'Error al crear estado' })
  }
})

// ─── PUT /api/admin/states/:id ───────────────────────────────────────────────
router.put('/states/:id', async (req, res) => {
  const { id }   = req.params
  const { name } = req.body
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre del estado es requerido' })
  }
  try {
    const [result] = await pool.query(
      'UPDATE states SET name = ? WHERE id = ?', [name.trim(), id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Estado no encontrado' })
    }
    res.json({ message: 'Estado actualizado', state: { id: Number(id), name: name.trim() } })
  } catch (err) {
    console.error('Error al actualizar estado:', err)
    res.status(500).json({ error: 'Error al actualizar estado' })
  }
})

// ─── DELETE /api/admin/states/:id ────────────────────────────────────────────
router.delete('/states/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [result] = await pool.query(
      'DELETE FROM states WHERE id = ?', [id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Estado no encontrado' })
    }
    res.json({ message: 'Estado eliminado junto con sus ciudades' })
  } catch (err) {
    console.error('Error al eliminar estado:', err)
    res.status(500).json({ error: 'Error al eliminar estado' })
  }
})

module.exports = router
