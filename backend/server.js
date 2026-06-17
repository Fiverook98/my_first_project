require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const comRoutes = require('./routes/comments')
const uploadRoutes = require('./routes/upload');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/login', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', comRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = 3000;
app.listen(PORT); 