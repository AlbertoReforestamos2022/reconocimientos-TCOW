const express = require('express')
const pool    = require('../db/connection')
const auth    = require('../middleware/auth')

const router = express.Router()

router.use(auth)

// ─── GET /api/projects ───────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [projects] = await pool.query(
      `SELECT id, name, created_at, updated_at
       FROM projects
       WHERE user_id = ?
       ORDER BY updated_at DESC`,
      [req.user.id]
    )
    res.json({ projects })
  } catch (err) {
    console.error('Error al obtener proyectos:', err)
    res.status(500).json({ error: 'Error al obtener proyectos' })
  }
})

// ─── GET /api/projects/:id ───────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' })
    }
    const project = rows[0]
    project.canvas_json = JSON.parse(project.canvas_json || '{}')
    res.json({ project })
  } catch (err) {
    console.error('Error al obtener proyecto:', err)
    res.status(500).json({ error: 'Error al obtener proyecto' })
  }
})

// ─── POST /api/projects ──────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, canvas_json } = req.body

  if (!canvas_json) {
    return res.status(400).json({ error: 'canvas_json es requerido' })
  }

  try {
    const jsonString = typeof canvas_json === 'string'
      ? canvas_json
      : JSON.stringify(canvas_json)

    const [result] = await pool.query(
      'INSERT INTO projects (user_id, name, canvas_json) VALUES (?, ?, ?)',
      [req.user.id, name || 'Sin título', jsonString]
    )

    res.status(201).json({
      message: 'Proyecto guardado',
      project: { id: result.insertId, name: name || 'Sin título' }
    })
  } catch (err) {
    console.error('Error al guardar proyecto:', err)
    res.status(500).json({ error: 'Error al guardar proyecto' })
  }
})

// ─── PUT /api/projects/:id ───────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { id }               = req.params
  const { name, canvas_json } = req.body

  try {
    const [rows] = await pool.query(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' })
    }

    const jsonString = typeof canvas_json === 'string'
      ? canvas_json
      : JSON.stringify(canvas_json)

    await pool.query(
      'UPDATE projects SET name = ?, canvas_json = ? WHERE id = ?',
      [name || 'Sin título', jsonString, id]
    )

    res.json({ message: 'Proyecto actualizado' })
  } catch (err) {
    console.error('Error al actualizar proyecto:', err)
    res.status(500).json({ error: 'Error al actualizar proyecto' })
  }
})

// ─── DELETE /api/projects/:id ────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [result] = await pool.query(
      'DELETE FROM projects WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' })
    }
    res.json({ message: 'Proyecto eliminado' })
  } catch (err) {
    console.error('Error al eliminar proyecto:', err)
    res.status(500).json({ error: 'Error al eliminar proyecto' })
  }
})

module.exports = router
