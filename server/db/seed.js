require('dotenv').config()
const mysql = require('mysql2/promise')

const DB_CONFIG = {
  host    : process.env.DB_HOST || 'localhost',
  port    : process.env.DB_PORT || 3306,
  user    : process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
}

// ─── Estados y ciudades principales de México ────────────────────────────────
const MEXICO_DATA = [
  { state: 'Aguascalientes',       cities: ['Aguascalientes', 'Calvillo', 'Jesús María', 'Rincón de Romos'] },
  { state: 'Baja California',      cities: ['Tijuana', 'Mexicali', 'Ensenada', 'Tecate', 'Rosarito'] },
  { state: 'Baja California Sur',  cities: ['La Paz', 'Los Cabos', 'Comondú', 'Loreto', 'Mulegé'] },
  { state: 'Campeche',             cities: ['Campeche', 'Ciudad del Carmen', 'Champotón', 'Calkiní'] },
  { state: 'Chiapas',              cities: ['Tuxtla Gutiérrez', 'San Cristóbal de las Casas', 'Tapachula', 'Comitán', 'Ocosingo'] },
  { state: 'Chihuahua',            cities: ['Chihuahua', 'Ciudad Juárez', 'Delicias', 'Cuauhtémoc', 'Hidalgo del Parral'] },
  { state: 'Ciudad de México',     cities: ['Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán', 'Cuauhtémoc', 'Gustavo A. Madero', 'Iztacalco', 'Iztapalapa', 'Miguel Hidalgo', 'Tlalpan', 'Xochimilco'] },
  { state: 'Coahuila',             cities: ['Saltillo', 'Torreón', 'Monclova', 'Piedras Negras', 'Acuña'] },
  { state: 'Colima',               cities: ['Colima', 'Manzanillo', 'Tecomán', 'Villa de Álvarez', 'Armería'] },
  { state: 'Durango',              cities: ['Durango', 'Gómez Palacio', 'Lerdo', 'Santiago Papasquiaro', 'El Salto'] },
  { state: 'Guanajuato',           cities: ['Guanajuato', 'León', 'Irapuato', 'Celaya', 'Salamanca', 'Silao', 'San Miguel de Allende'] },
  { state: 'Guerrero',             cities: ['Chilpancingo', 'Acapulco', 'Zihuatanejo', 'Taxco', 'Iguala'] },
  { state: 'Hidalgo',              cities: ['Pachuca', 'Tulancingo', 'Tula de Allende', 'Ixmiquilpan', 'Tizayuca'] },
  { state: 'Jalisco',              cities: ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Puerto Vallarta', 'Lagos de Moreno', 'Tepatitlán', 'Ocotlán'] },
  { state: 'Estado de México',     cities: ['Toluca', 'Ecatepec', 'Naucalpan', 'Nezahualcóyotl', 'Tlalnepantla', 'Texcoco', 'Atlacomulco', 'Metepec'] },
  { state: 'Michoacán',            cities: ['Morelia', 'Zamora', 'Uruapan', 'Apatzingán', 'Lázaro Cárdenas', 'Pátzcuaro'] },
  { state: 'Morelos',              cities: ['Cuernavaca', 'Jiutepec', 'Cuautla', 'Temixco', 'Yautepec'] },
  { state: 'Nayarit',              cities: ['Tepic', 'Bahía de Banderas', 'Compostela', 'Santiago Ixcuintla', 'Tuxpan'] },
  { state: 'Nuevo León',           cities: ['Monterrey', 'San Pedro Garza García', 'Guadalupe', 'Apodaca', 'Escobedo', 'Santa Catarina', 'San Nicolás de los Garza'] },
  { state: 'Oaxaca',               cities: ['Oaxaca de Juárez', 'Salina Cruz', 'Juchitán', 'Tuxtepec', 'Puerto Escondido'] },
  { state: 'Puebla',               cities: ['Puebla', 'Tehuacán', 'San Martín Texmelucan', 'Atlixco', 'Cholula', 'Amozoc'] },
  { state: 'Querétaro',            cities: ['Querétaro', 'San Juan del Río', 'Corregidora', 'El Marqués', 'Amealco'] },
  { state: 'Quintana Roo',         cities: ['Cancún', 'Chetumal', 'Playa del Carmen', 'Cozumel', 'Tulum'] },
  { state: 'San Luis Potosí',      cities: ['San Luis Potosí', 'Soledad de Graciano Sánchez', 'Ciudad Valles', 'Matehuala', 'Tamazunchale'] },
  { state: 'Sinaloa',              cities: ['Culiacán', 'Mazatlán', 'Los Mochis', 'Guasave', 'Guamúchil'] },
  { state: 'Sonora',               cities: ['Hermosillo', 'Ciudad Obregón', 'Nogales', 'San Luis Río Colorado', 'Guaymas', 'Navojoa'] },
  { state: 'Tabasco',              cities: ['Villahermosa', 'Cárdenas', 'Comalcalco', 'Paraíso', 'Huimanguillo'] },
  { state: 'Tamaulipas',           cities: ['Ciudad Victoria', 'Reynosa', 'Matamoros', 'Nuevo Laredo', 'Tampico', 'Altamira'] },
  { state: 'Tlaxcala',             cities: ['Tlaxcala', 'Apizaco', 'Huamantla', 'Chiautempan', 'Calpulalpan'] },
  { state: 'Veracruz',             cities: ['Xalapa', 'Veracruz', 'Coatzacoalcos', 'Córdoba', 'Orizaba', 'Poza Rica', 'Minatitlán'] },
  { state: 'Yucatán',              cities: ['Mérida', 'Valladolid', 'Progreso', 'Tizimín', 'Kanasín'] },
  { state: 'Zacatecas',            cities: ['Zacatecas', 'Fresnillo', 'Guadalupe', 'Jerez', 'Calera'] },
]

async function runMigrations(conn) {
  console.log('Ejecutando migraciones...')

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'branding_editor'}\``)
  await conn.query(`USE \`${process.env.DB_NAME || 'branding_editor'}\``)

  await conn.query(`
    CREATE TABLE IF NOT EXISTS states (
      id   INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    )
  `)

  await conn.query(`
    CREATE TABLE IF NOT EXISTS cities (
      id       INT AUTO_INCREMENT PRIMARY KEY,
      name     VARCHAR(100) NOT NULL,
      state_id INT NOT NULL,
      FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
    )
  `)

  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      username   VARCHAR(80)  UNIQUE NOT NULL,
      email      VARCHAR(150) UNIQUE NOT NULL,
      password   VARCHAR(255) NOT NULL,
      role       ENUM('user','admin') DEFAULT 'user',
      city_id    INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await conn.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT NOT NULL,
      name        VARCHAR(150) DEFAULT 'Sin título',
      canvas_json LONGTEXT,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // FK users → cities (se agrega después de que cities ya existe)
  try {
    await conn.query(`
      ALTER TABLE users
        ADD CONSTRAINT fk_user_city
        FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL
    `)
  } catch (e) {
    // Si ya existe el constraint, ignorar
  }

  console.log('Migraciones completadas')
}

async function runSeed(conn) {
  const [existing] = await conn.query('SELECT COUNT(*) as count FROM states')
  if (existing[0].count > 0) {
    console.log('Seed ya ejecutado anteriormente, omitiendo...')
    return
  }

  console.log('Insertando estados y ciudades de México...')

  for (const entry of MEXICO_DATA) {
    const [result] = await conn.query(
      'INSERT INTO states (name) VALUES (?)',
      [entry.state]
    )
    const stateId = result.insertId
    for (const city of entry.cities) {
      await conn.query(
        'INSERT INTO cities (name, state_id) VALUES (?, ?)',
        [city, stateId]
      )
    }
  }

  // Crear usuario admin por defecto
  const bcrypt = require('bcryptjs')
  const adminPass = await bcrypt.hash('Admin1234!', 10)
  await conn.query(`
    INSERT IGNORE INTO users (username, email, password, role)
    VALUES ('admin', 'admin@brandingeditor.com', ?, 'admin')
  `, [adminPass])

  console.log('Seed completado')
  console.log('─────────────────────────────────────────')
  console.log('Admin por defecto:')
  console.log('   Email:    admin@brandingEditor.com')
  console.log('   Password: Admin1234!')
  console.log('Cambia el password en producción')
  console.log('─────────────────────────────────────────')
}

async function main() {
  const conn = await mysql.createConnection(DB_CONFIG)
  try {
    await runMigrations(conn)
    await runSeed(conn)
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await conn.end()
    console.log('Conexión cerrada')
  }
}

main()
