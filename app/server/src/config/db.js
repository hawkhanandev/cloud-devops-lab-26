const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool to PostgreSQL
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌  Failed to connect to PostgreSQL:', err.message);
  } else {
    console.log('✅  Connected to PostgreSQL database.');
    release();
  }
});

module.exports = pool;
