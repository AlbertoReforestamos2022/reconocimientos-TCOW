const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host    : process.env.DB_HOST     || 'localhost',
  port    : process.env.DB_PORT     || 3306,
  user    : process.env.DB_USER     || 'root',
  password: process.env.DB_PASS     || '',
  database: process.env.DB_NAME     || 'reconocimientos_tcw',
  waitForConnections: true,
  connectionLimit   : 10,
  queueLimit        : 0,
})

pool.getConnection()
  .then(() => console.log('Conexión exitosa'))
  .catch(err => console.error('Error en la conexión:', err.message))

module.exports = pool
