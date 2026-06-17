const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');

// Configurazione multer con nome file personalizzato
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Mantieni l'estensione originale
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + ext;
    cb(null, name);
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('coverImage'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: 'Nessun file caricato' });
  }
  const filePath = `/uploads/${file.filename}`;
  res.status(200).json({ success: true, filePath });
});

router.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('./uploads', filename);
  res.sendFile(path.resolve(filePath));
});

router.delete('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('./uploads', filename);
  
  const fs = require('fs');
  
  fs.unlink(path.resolve(filePath), (err) => {
    if (err) {
      console.error('Errore eliminazione file:', err);
      return res.status(500).json({ success: false, message: 'Errore eliminazione file' });
    }
    res.json({ success: true, message: 'File eliminato con successo' });
  });
});

module.exports = router;