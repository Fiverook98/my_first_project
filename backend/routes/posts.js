const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
  const { title, content, user_id, coverImage, tags } = req.body;

  try {
    const result = await db.query(
      `WITH user_info AS (
        SELECT username FROM users WHERE id = $4
          )
        INSERT INTO posts (id, title, content, user_id, author, cover_image, tags)
        SELECT $1, $2, $3, $4, user_info.username, $5, $6
        FROM user_info
        RETURNING *`,
      [uuidv4(), title, content, user_id, coverImage || null, tags]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Errore POST /posts:', err);
    res.status(500).json({ error: 'Errore nel salvataggio del post' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, title, content, user_id, author, created_at, cover_image as "coverImage", tags FROM posts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Errore GET /posts:', err);
    res.status(500).json({ error: 'Errore nel recupero dei post' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT id, title, content, user_id, author, created_at, cover_image as "coverImage", tags FROM posts WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post non trovato' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Errore GET /posts/:id:', err);
    res.status(500).json({ error: 'Errore nel recupero del post' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prima recupera il post per ottenere il percorso dell'immagine
    const postResult = await db.query('SELECT cover_image FROM posts WHERE id = $1', [id]);
    
    if (postResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Post non trovato' });
    }
    
    const coverImage = postResult.rows[0].cover_image;
    
    // Elimina il post dal database
    const deleteResult = await db.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    
    // Se il post aveva un'immagine, eliminala dal filesystem
    if (coverImage) {
      const fs = require('fs');
      const path = require('path');
      
      // Estrai il nome del file dal percorso (rimuovi /uploads/)
      const filename = coverImage.replace('/uploads/', '');
      const filePath = path.join('./uploads', filename);
      
      fs.unlink(path.resolve(filePath), (err) => {
        if (err) {
          console.error('Errore eliminazione immagine:', err);
          // Non fare fallire la richiesta se l'immagine non può essere eliminata
        } else {
          console.log('Immagine eliminata:', filename);
        }
      });
    }

    res.json({ success: true, deleted: deleteResult.rows[0] });
  } catch (err) {
    console.error('Errore DELETE /posts/:id:', err);
    res.status(500).json({ success: false, error: 'Errore durante la cancellazione' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Mappa i nomi dei campi dal frontend (camelCase) al database (snake_case)
    const fieldMapping = {
      'coverImage': 'cover_image',
      'title': 'title',
      'content': 'content',
      'author': 'author',
      'tags': 'tags'
    };

    const dbUpdates = {};
    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMapping[key] || key;
      dbUpdates[dbField] = value;
    }

    const fields = Object.keys(dbUpdates);
    const values = Object.values(dbUpdates);

    const setClause = fields.map((field, idx) => `${field} = $${idx + 2}`).join(', ');
    const query = `UPDATE posts SET ${setClause} WHERE id = $1 RETURNING *`;
    const result = await db.query(query, [id, ...values]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Post non trovato' });
    }

    res.json({ success: true, updated: result.rows[0] });
  } catch (err) {
    console.error('Errore PATCH /posts/:id:', err);
    res.status(500).json({ success: false, error: 'Errore durante l\'aggiornamento' });
  }
});

module.exports = router;