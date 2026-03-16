const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const multer = require('multer');

const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

// Filtrage des fichiers (Contrainte de sécurité )
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/; // Extensions autorisées 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error("Seuls les formats JPG, PNG et PDF sont autorisés."));
  }
});


// La route pour récupérer les signalements
router.get('/', reportController.getAllReports);

// Route modifiée pour accepter un fichier
router.get('/my-reports', reportController.getMyReports);
router.post('/', upload.single('file'), reportController.createReport);

module.exports = router; 