const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Routes pour l'administration
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser); 
router.get('/logs', adminController.getLogs);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/status', adminController.toggleUserStatus);

module.exports = router;