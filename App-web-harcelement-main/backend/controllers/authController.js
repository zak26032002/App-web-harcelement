const db = require('../config/db');
const bcrypt = require('bcryptjs'); // ou 'bcrypt' selon ce que tu as installé
const jwt = require('jsonwebtoken'); // Si tu utilises des tokens

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. On cherche l'utilisateur par son email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Identifiants incorrects" });
    }

    const user = rows[0];

    // 2. COMPARISON MAGIQUE : On compare le mot de passe saisi avec le hash de la BDD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Si ça ne matche pas, on renvoie une 401
      return res.status(401).json({ success: false, message: "Identifiants incorrects" });
    }

    // 3. Si c'est bon, on génère la réponse (et un token si besoin)
    res.json({
      success: true,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role // C'est ici que 'admin', 'user', etc. arrivent au front
      }
    });

  } catch (error) {
    console.error("Erreur login backend:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};