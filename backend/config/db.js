/* eslint-disable no-undef */
const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/../.env' });

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

(async () => {
  try {
    await pool.query("SET search_path TO  public");
    // console.log("Schema impostato correttamente");
  } catch (err) {
    console.error("Errore nell'impostare lo schema:", err);
  }
})();

module.exports = pool;