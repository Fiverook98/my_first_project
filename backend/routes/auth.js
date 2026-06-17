const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      'SELECT id, username, birthdate, role FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Credenziali non valide' });
    }
  } catch (err) {
    console.error('Errore nella query:', err);
    res.status(500).json({ success: false, message: 'Errore interno del server' });
  }
});

module.exports = router;