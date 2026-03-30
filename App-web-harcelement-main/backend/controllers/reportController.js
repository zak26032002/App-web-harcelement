const db = require('../config/db');
const crypto = require('crypto');

// 1. Créer un nouveau signalement (Salarié)
exports.createReport = async (req, res) => {
    try {
        // On récupère les données envoyées par le FormData
        const { type, description, userId, auteur } = req.body;
        const pieceJointe = req.file ? req.file.filename : null;

        // Génération du code unique SIG-XXXXXX
        const codeSuivi = `SIG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        // Insertion dans la table selon tes colonnes BDD
        const query = `
            INSERT INTO signalements 
            (type, description, statut, priorite, auteur, user_id, code_suivi, piece_jointe, date_creation, date) 
            VALUES (?, ?, 'OUVERT', 'Moyenne', ?, ?, ?, ?, NOW(), NOW())
        `;

        await db.query(query, [
            type, 
            description, 
            auteur,   // Sera "Anonyme" ou le nom du user selon ton front
            userId, 
            codeSuivi, 
            pieceJointe
        ]);

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

// 2. Récupérer uniquement les rapports de l'utilisateur connecté (Salarié)
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

// 3. Récupérer TOUS les rapports (Pour les RH / Juristes)
exports.getAllReports = async (req, res) => {
    try {
        // On récupère tout, la colonne 'auteur' contient déjà "Anonyme" ou le Nom
        const [rows] = await db.query('SELECT * FROM signalements ORDER BY date_creation DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Erreur GetAllReports :", error);
        res.status(500).json({ success: false, message: "Erreur de récupération" });
    }
};

// 4. Récupérer un signalement précis (Détails + Commentaires)
exports.getReportById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM signalements WHERE id = ?', [req.params.id]);
        const [comments] = await db.query(
            'SELECT * FROM commentaires WHERE signalement_id = ? ORDER BY date_publication ASC', 
            [req.params.id]
        );
        res.json({ success: true, report: rows[0], comments });
    } catch (error) {
        console.error("Erreur GetReportById :", error);
        res.status(500).json({ success: false });
    }
};

// 5. Ajouter un commentaire
exports.addComment = async (req, res) => {
    const { auteur_nom, message } = req.body;
    try {
        await db.query(
            'INSERT INTO commentaires (signalement_id, auteur_nom, message, date_publication) VALUES (?, ?, ?, NOW())', 
            [req.params.id, auteur_nom, message]
        );
        res.json({ success: true });
    } catch (error) {
        console.error("Erreur AddComment :", error);
        res.status(500).json({ success: false });
    }
};

// 6. Modifier le statut (RH)
exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { statut } = req.body;
    try {
        await db.query('UPDATE signalements SET statut = ? WHERE id = ?', [statut, id]);
        res.json({ success: true, message: "Statut mis à jour en BDD" });
    } catch (error) {
        console.error("Erreur SQL updateStatus :", error);
        res.status(500).json({ success: false, message: "Erreur BDD" });
    }
};