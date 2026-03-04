const express = require('express')
const pool    = require('../../db/connection')
const auth    = require('../../middleware/auth')
const isAdmin = require('../../middleware/isAdmin')

const router = express.Router()

router.use(auth, isAdmin)

// ─── GET /api/admin/cities ───────────────────────────────────────────────────
router.get('/cities', async (req, res) => {
  const { state_id } = req.query
  try {
    let query  = `
      SELECT c.id, c.name, c.state_id, s.name AS state_name
      FROM cities c
      JOIN states s ON c.state_id = s.id
    `
    const params = []
    if (state_id) {
      query += ' WHERE c.state_id = ?'
      params.push(state_id)
    }
    query += ' ORDER BY s.name ASC, c.name ASC'

    const [cities] = await pool.query(query, params)
    res.json({ cities })
  } catch (err) {
    console.error('Error al obtener ciudades (admin):', err)
    res.status(500).json({ error: 'Error al obtener ciudades' })
  }
})

// ─── POST /api/admin/cities ──────────────────────────────────────────────────
router.post('/cities', async (req, res) => {
  const { name, state_id } = req.body
  if (!name || !state_id) {
    return res.status(400).json({ error: 'name y state_id son requeridos' })
  }
  try {
    const [stateExists] = await pool.query(
      'SELECT id FROM states WHERE id = ?', [state_id]
    )
    if (stateExists.length === 0) {
      return res.status(404).json({ error: 'El estado especificado no existe' })
    }
    const [result] = await pool.query(
      'INSERT INTO cities (name, state_id) VALUES (?, ?)',
      [name.trim(), state_id]
    )
    res.status(201).json({
      message: 'Ciudad creada',
      city: { id: result.insertId, name: name.trim(), state_id }
    })
  } catch (err) {
    console.error('Error al crear ciudad:', err)
    res.status(500).json({ error: 'Error al crear ciudad' })
  }
})

// ─── PUT /api/admin/cities/:id ───────────────────────────────────────────────
router.put('/cities/:id', async (req, res) => {
  const { id }             = req.params
  const { name, state_id } = req.body
  if (!name) {
    return res.status(400).json({ error: 'El nombre de la ciudad es requerido' })
  }
  try {
    const updates = ['name = ?']
    const params  = [name.trim()]

    if (state_id) {
      updates.push('state_id = ?')
      params.push(state_id)
    }
    params.push(id)

    const [result] = await pool.query(
      `UPDATE cities SET ${updates.join(', ')} WHERE id = ?`, params
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' })
    }
    res.json({ message: 'Ciudad actualizada' })
  } catch (err) {
    console.error('Error al actualizar ciudad:', err)
    res.status(500).json({ error: 'Error al actualizar ciudad' })
  }
})

// ─── DELETE /api/admin/cities/:id ────────────────────────────────────────────
router.delete('/cities/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [result] = await pool.query(
      'DELETE FROM cities WHERE id = ?', [id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' })
    }
    res.json({ message: 'Ciudad eliminada' })
  } catch (err) {
    console.error('Error al eliminar ciudad:', err)
    res.status(500).json({ error: 'Error al eliminar ciudad' })
  }
})

module.exports = router
