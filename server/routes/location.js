const express = require('express')
const pool    = require('../db/connection')

const router = express.Router()

// ─── GET /api/states ──────────────────────────────────────────────────────────
router.get('/states', async (req, res) => {
  try {
    const [states] = await pool.query(
      'SELECT id, name FROM states ORDER BY name ASC'
    )
    res.json({ states })
  } catch (err) {
    console.error('Error al obtener estados:', err)
    res.status(500).json({ error: 'Error al obtener estados' })
  }
})

// ─── GET /api/states/:id/cities ───────────────────────────────────────────────
router.get('/states/:id/cities', async (req, res) => {
  const { id } = req.params

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID de estado inválido' })
  }

  try {
    const [stateRows] = await pool.query(
      'SELECT id, name FROM states WHERE id = ?', [id]
    )
    if (stateRows.length === 0) {
      return res.status(404).json({ error: 'Estado no encontrado' })
    }

    const [cities] = await pool.query(
      'SELECT id, name FROM cities WHERE state_id = ? ORDER BY name ASC',
      [id]
    )

    res.json({
      state : stateRows[0],
      cities,
    })
  } catch (err) {
    console.error('Error al obtener ciudades:', err)
    res.status(500).json({ error: 'Error al obtener ciudades' })
  }
})

module.exports = router
