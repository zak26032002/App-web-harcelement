const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Routes pour l'administration
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser); 
router.get('/logs', adminController.getLogs);

module.exports = router;