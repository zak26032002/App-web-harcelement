const db = require('../config/db');
const bcrypt = require('bcrypt');

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nom, email, role, date_creation FROM users ORDER BY date_creation DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Erreur SQL getAllUsers :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Créer un utilisateur (Action Admin)
exports.createUser = async (req, res) => {
  const { nom, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Pas besoin d'ajouter date_creation ici, le DEFAULT de la BDD s'en charge
    await db.query(
      'INSERT INTO users (nom, email, password, role) VALUES (?, ?, ?, ?)',
      [nom, email, hashedPassword, role]
    );

    // On log l'action pour l'admin
    await db.query('INSERT INTO logs (action, details) VALUES (?, ?)', 
      ['ADMIN_CREATE_USER', `Compte créé : ${email} (Rôle: ${role})`]);

    res.json({ success: true, message: "Utilisateur créé avec succès" });
  } catch (error) {
    console.error("Erreur SQL createUser :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer les Logs d'Audit
exports.getLogs = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM logs ORDER BY date_action DESC LIMIT 100');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};