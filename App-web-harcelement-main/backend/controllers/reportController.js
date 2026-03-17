const db = require('../config/db');
const crypto = require('crypto');

// 1. Créer un nouveau signalement
exports.createReport = async (req, res) => {
  const { type, description, userId, isAnonymous } = req.body;
  // Nom du fichier stocké via Multer 
  const pieceJointe = req.file ? req.file.filename : null; 

  try {
    // Génération du code unique pour le suivi salarié 
    const codeSuivi = `SIG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    
    // Insertion avec le statut initial 'OUVERT' 
    // Note : on stocke userId pour le suivi, mais 'Anonyme' peut être géré à l'affichage 
    await db.query(
      'INSERT INTO signalements (type, description, user_id, code_suivi, piece_jointe, statut) VALUES (?, ?, ?, ?, ?, ?)',
      [type, description, userId, codeSuivi, pieceJointe, 'OUVERT']
    );

    res.status(201).json({ 
      success: true, 
      message: "Signalement enregistré avec succès", 
      code: codeSuivi 
    });
  } catch (error) {
    console.error("Erreur création rapport:", error);
    res.status(500).json({ success: false, message: "Erreur lors de l'enregistrement" });
  }
};

// 2. Récupérer uniquement les rapports de l'utilisateur connecté 
exports.getMyReports = async (req, res) => {
  const { userId } = req.query;
  try {
    const [rows] = await db.query(
      'SELECT * FROM signalements WHERE user_id = ? ORDER BY date_creation DESC', 
      [userId]
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Erreur MyReports :", error);
    res.status(500).json({ success: false, message: "Erreur de récupération" });
  }
};

// 3. Récupérer TOUS les rapports (Pour les RH / Juristes) [
exports.getAllReports = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM signalements ORDER BY date_creation DESC');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Erreur GetAllReports :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Récupérer un signalement précis
exports.getReportById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM signalements WHERE id = ?', [req.params.id]);
    const [comments] = await db.query('SELECT * FROM commentaires WHERE signalement_id = ? ORDER BY date_publication ASC', [req.params.id]);
    res.json({ success: true, report: rows[0], comments });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// Ajouter un commentaire
exports.addComment = async (req, res) => {
  const { auteur_nom, message } = req.body;
  try {
    await db.query('INSERT INTO commentaires (signalement_id, auteur_nom, message) VALUES (?, ?, ?)', 
      [req.params.id, auteur_nom, message]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// Modifier le statut 
exports.updateStatus = async (req, res) => {
  const { id } = req.params; // Récupéré de l'URL /api/reports/:id/status
  const { statut } = req.body; // Récupéré du JSON envoyé

  try {
    // Seuls les RH et juristes peuvent changer les statuts 
    await db.query('UPDATE signalements SET statut = ? WHERE id = ?', [statut, id]);
    
    // Journalisation de l'action pour le journal d'audit 
    console.log(`Statut du signalement ${id} mis à jour : ${statut}`);
    
    res.json({ success: true, message: "Statut mis à jour en BDD" });
  } catch (error) {
    console.error("Erreur SQL updateStatus :", error);
    res.status(500).json({ success: false, message: "Erreur BDD" });
  }
};
