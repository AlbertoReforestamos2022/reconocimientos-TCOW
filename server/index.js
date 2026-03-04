require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const authRoutes     = require('./routes/auth')
const locationRoutes = require('./routes/location')
const projectRoutes  = require('./routes/projects')
const adminStates    = require('./routes/admin/states')
const adminCities    = require('./routes/admin/cities')
const adminUsers     = require('./routes/admin/users')

const app  = express()
const PORT = process.env.PORT || 3000

/* =====================
    Middleware global
======================== */
app.use(cors({ origin: 'http://localhost:5173', 
  credentials: true
}))
app.use(express.json())

/* ======================
    Rutas
========================== */
app.use('/api/auth'    , authRoutes)
app.use('/api'         , locationRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/admin'   , adminStates)
app.use('/api/admin'   , adminCities)
app.use('/api/admin'   , adminUsers)

/* ======================
    Ruta de salud
========================== */
app.get('/api/health', (_req, res) => {
  res.json({
    status : 'ok',
    message: 'Servidor corriendo'
  })
})

/* =================================
    Manejo de rutas no encontradas
==================================== */
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

/* =================================
    Manejo de errores
====================================== */
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
