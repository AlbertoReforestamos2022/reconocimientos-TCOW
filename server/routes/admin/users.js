const express = require('express')
const pool    = require('../../db/connection')
const auth    = require('../../middleware/auth')
const isAdmin = require('../../middleware/isAdmin')

const router = express.Router()

router.use(auth, isAdmin)

// ─── GET /api/admin/users ────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT u.id, u.username, u.email, u.role, u.created_at,
             c.name AS city_name, s.name AS state_name,
             COUNT(p.id) AS project_count
      FROM users u
      LEFT JOIN cities  c ON u.city_id  = c.id
      LEFT JOIN states  s ON c.state_id = s.id
      LEFT JOIN projects p ON p.user_id  = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `)
    res.json({ users })
  } catch (err) {
    console.error('Error al obtener usuarios:', err)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
})

// ─── PUT /api/admin/users/:id/role ───────────────────────────────────────────
router.put('/users/:id/role', async (req, res) => {
  const { id }   = req.params
  const { role } = req.body

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Rol inválido. Debe ser "user" o "admin"' })
  }

  if (Number(id) === req.user.id) {
    return res.status(400).json({ error: 'No puedes cambiar tu propio rol' })
  }

  try {
    // Obtener el rol actual del usuario
    const [userRows] = await pool.query('SELECT role FROM users WHERE id = ?', [id])
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    const currentRole = userRows[0].role

    if (currentRole === 'admin' && role === 'user') {
      // Contar cuántos admins hay
      const [adminCountRows] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "admin"')
      const adminCount = adminCountRows[0].count
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'No se puede quitar el rol de administrador al último administrador' })
      }
    }

    if (currentRole === 'user' && role === 'admin') {
      // Contar cuántos admins hay
      const [adminCountRows] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "admin"')
      const adminCount = adminCountRows[0].count
      if (adminCount >= 1) {
        return res.status(400).json({ error: 'Solo puede haber un administrador en el sistema' })
      }
    }

    const [result] = await pool.query(
      'UPDATE users SET role = ? WHERE id = ?', [role, id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Success response (assuming you want to confirm the update)
    res.json({ message: 'Rol actualizado exitosamente' })
  } catch (error) {
    console.error('Error updating user role:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// ─── DELETE /api/admin/users/:id ─────────────────────────────────────────────
// router.delete('/users/:id', async (req, res) => {
//   const { id } = req.params

//   if (Number(id) === req.user.id) {
//     return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' })
//   }

//   try {
//     // Obtener el rol del usuario a eliminar
//     const [userRows] = await pool.query('SELECT role FROM users WHERE id = ?', [id])
//     if (userRows.length === 0) {
//       return res.status(404).json({ error: 'Usuario no encontrado' })
//     }
//     const userRole = userRows[0].role

//     if (userRole === 'user') {
//       return res.status(400).json({ error: 'No se pueden eliminar usuarios normales' })
//     }

//     if (userRole === 'admin') {
//       // Contar cuántos admins hay
//       const [adminCountRows] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "admin"')
//       const adminCount = adminCountRows[0].count
//       if (adminCount <= 1) {
//         return res.status(400).json({ error: 'No se puede eliminar el último administrador' })
//       }
//     }

//     const [result] = await pool.query(
//       'DELETE FROM users WHERE id = ?', [id]
//     )
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Usuario no encontrado' })
//     }
//     res.json({ message: 'Usuario eliminado' })
//   } catch (err) {
//     console.error('Error al eliminar usuario:', err)
//     res.status(500).json({ error: 'Error al eliminar usuario' })
//   }
// })

module.exports = router
