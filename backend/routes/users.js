const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, birthdate, role FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Errore GET /users:', err);
    res.status(500).json({ error: 'Errore durante il recupero utenti' });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db.query(
      'SELECT id, username, birthdate, role FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Utente non trovato' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Errore GET /users/:id:', err);
    res.status(500).json({ error: 'Errore server' });
  }
});

router.post('/', async (req, res) => {
  const { username, password, birthdate } = req.body;

  if (!username || !password || !birthdate) {
    return res.status(400).json({ success: false, message: 'Dati mancanti' });
  }

  try {
    const check = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (check.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Utente già registrato' });
    }

    const role = password[0] === '_' ? 'admin' : 'user';

    const newUser = await db.query(
      `INSERT INTO users (id, username, password, birthdate, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, birthdate, role`,
      [uuidv4(), username, password, birthdate, role]
    );  

    res.status(201).json({ success: true, user: newUser.rows[0] });
  } catch (err) {
    console.error('Errore POST /users:', err);
    res.status(500).json({ error: 'Errore durante la creazione utente' });
  }
});

router.patch('/:userId', async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'Nessun dato da aggiornare' });
    }

    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');

    const result = await db.query(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, username, password, birthdate, role, email, phone_number, address, updated_at`,
      [userId, ...values]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Utente non trovato' });
    }

    res.json({ success: true, updated: result.rows[0] });
  } catch (err) {
    console.error('Errore PATCH /users:', err);
    res.status(500).json({ error: 'Errore durante l’aggiornamento' });
  }
});

router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, username',
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Utente non trovato' });
    }

    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    console.error('Errore DELETE /users:', err);
    res.status(500).json({ error: 'Errore durante l’eliminazione' });
  }
});

router.get('/:userId/profile', async (req, res) => {
  const { userId } = req.params;

  try {
    const userProfile = await db.query(
      'SELECT id, username, birthdate, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userProfile.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Profilo utente non trovato' });
    }

    res.json(userProfile.rows[0]);
  } catch (err) {
    console.error('Errore GET /users/:userId/profile:', err);
    res.status(500).json({ error: 'Errore durante il recupero del profilo utente' });
  }
});

module.exports = router;