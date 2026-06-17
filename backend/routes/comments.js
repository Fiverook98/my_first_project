/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuidv4, validate: isUUID } = require('uuid');

router.get('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { validate: isUUID } = require('uuid');

  if (!isUUID(postId)) {
    return res.status(400).json({ error: 'ID post non valido' });
  }
  // console.log('postId ricevuto:', postId);

  try {
    const result = await db.query(
      `SELECT comments.id, comments.content, users.username, comments.created_at
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = $1
       ORDER BY comments.created_at ASC`,
      [postId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Errore nella query:', err);
    res.status(500).json({ error: 'Errore nel recupero dei commenti' });
  }
});

router.post('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { content, user_id } = req.body;

  try {
    const newId = uuidv4();

    await db.query(
      `INSERT INTO comments (id, content, post_id, user_id)
       VALUES ($1, $2, $3, $4)`,
      [newId, content, postId, user_id]
    );

    res.status(201).json({ id: newId, content, user_id, post_id: postId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel salvataggio del commento' });
  }
});

router.delete('/posts/:postId/comments/:commentId', async (req, res) => {
  const { commentId, postId } = req.params;

  try {
    const result = await db.query(
      `DELETE FROM comments WHERE id = $1 AND post_id = $2 RETURNING *`,
      [commentId, postId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Commento non trovato' });
    }

    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante la cancellazione del commento' });
  }
});

router.post('/posts/:postId/comments/:commentId/replies', async (req, res) => {
  const { postId, commentId } = req.params;
  const { content, user_id } = req.body;

  try {
    const newId = uuidv4();

    await db.query(
      `INSERT INTO replies (id, content, comment_id, user_id)
       VALUES ($1, $2, $3, $4)`,
      [newId, content, commentId, user_id]
    );

    res.status(201).json({ id: newId, content, user_id, comment_id: commentId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel salvataggio della risposta' });
  }
});

router.get('/posts/:postId/comments/:commentId/replies', async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const result = await db.query(
      `SELECT replies.id, replies.content, users.username, replies.created_at
       FROM replies
       JOIN users ON replies.user_id = users.id
       WHERE replies.comment_id = $1
       ORDER BY replies.created_at ASC`,
      [commentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Errore nella query:', err);
    res.status(500).json({ error: 'Errore nel recupero delle risposte' });
  }
});

router.delete('/posts/:postId/comments/:commentId/replies/:replyId', async (req, res) => {
  const { commentId, replyId } = req.params;

  try {
    const result = await db.query(
      `DELETE FROM replies WHERE id = $1 AND comment_id = $2 RETURNING *`,
      [replyId, commentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Risposta non trovata' });
    }

    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante la cancellazione della risposta' });
  }
});

module.exports = router;