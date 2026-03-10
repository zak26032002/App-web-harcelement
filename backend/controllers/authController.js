const db = require('../config/db');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute(
      "SELECT id, nom, email, role FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Identifiants incorrects" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};