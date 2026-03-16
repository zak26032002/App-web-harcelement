const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const path = require('path');

// 1. Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Import des routes (Une seule fois chaque !)
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');

// 3. Activation des routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// 4. Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur prêt sur http://localhost:${PORT}`);
});