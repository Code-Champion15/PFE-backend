const FileVisit = require('../Models/fileVisit'); 
const { fn, col, Sequelize } = require('sequelize');
//const {sequelize} = require("../Db/db");

exports.trackVisit = async (req, res) => {
  const { pageName } = req.params;
  const user = req.user || {}; 
  const { startTime, endTime} = req.body;

  try {
    if (!pageName || !startTime || !endTime) {
      return res.status(400).json({ error: 'Le nom de la page, startTime et endTime sont requis' });
    }
    const durationSeconds = Math.floor((endTime - startTime) / 1000);

    // Création de l'enregistrement de la visite
    await FileVisit.create({
      pageName,
      userId: user.id || null,
      username: user.username || 'Anonyme',
      visitTime: new Date(startTime),
      durationSeconds: durationSeconds
    });

    return res.status(200).json({ message: 'Visite enregistrée avec succès' });
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de la visite:', err);
    return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la visite' });
  }
};

exports.getAllStats = async (req, res) => {
  try {
    const stats = await FileVisit.findAll({
      attributes: [
        'pageName', // Groupement par pageName
        [FileVisit.sequelize.fn('COUNT', FileVisit.sequelize.col('id')), 'visitCount'],
        [FileVisit.sequelize.fn('SUM', FileVisit.sequelize.col('durationSeconds')), 'totalDuration'],
        [FileVisit.sequelize.fn('AVG', FileVisit.sequelize.col('durationSeconds')), 'averageDuration'],
      ],
      group: ['pageName'], // Très important : group by pageName
      order: [[FileVisit.sequelize.fn('COUNT', FileVisit.sequelize.col('id')), 'DESC']], // Optionnel : trier par nombre de visites
    });

    return res.status(200).json(stats);
  } catch (err) {
    console.error('Erreur lors de la récupération des statistiques par page:', err);
    return res.status(500).json({ error: 'Erreur lors de la récupération des statistiques par page' });
  }
};

// FileVisitController.js

// exports.getVisitTimes = async (req, res) => {
//   const { pageName } = req.params;

//   try {
//     if (!pageName) {
//       return res.status(400).json({ error: 'Le nom de la page est requis' });
//     }

//     // Récupérer toutes les visites pour le fichier spécifique
//     const visits = await FileVisit.findAll({
//       where: { pageName },
//       attributes: ['visitTime'],
//       order: [['visitTime', 'ASC']], // Tri des visites par heure
//     });

//     if (!visits || visits.length === 0) {
//       return res.status(404).json({ message: 'Aucune visite trouvée pour ce fichier.' });
//     }

//     // Extraire les heures des visites
//     const visitTimes = visits.map(visit => visit.visitTime.getHours());

//     return res.status(200).json({ visitTimes });
//   } catch (err) {
//     console.error('Erreur lors de la récupération des horaires de visite:', err);
//     return res.status(500).json({ error: 'Erreur lors de la récupération des horaires de visite' });
//   }
// };

// Fonction pour récupérer les statistiques horaires d'une page spécifique
// exports.getHourlyStatsByPage = async (req, res) => {
//   try {
//     const { pageName } = req.query; // Utilisez `pageName` pour identifier la page

//     if (!pageName) {
//       return res.status(400).json({ error: 'Le nom de la page est requis' });
//     }

//     // Récupérer les statistiques horaires pour la page demandée
//     const stats = await FileVisit.findAll({
//       where: { pageName },  // Filtrer par `pageName` dans `FileVisit`
//       attributes: [
//         [sequelize.fn('HOUR', sequelize.col('visitTime')), 'hour'],
//         [sequelize.fn('COUNT', '*'), 'visits'],
//         [sequelize.fn('AVG', sequelize.col('durationSeconds')), 'avgDuration']
//       ],
//       group: ['hour'],
//       order: [[sequelize.fn('HOUR', sequelize.col('visitTime')), 'ASC']] // Trier par heure
//     });

//     // Retourner les résultats des statistiques horaires
//     res.status(200).json(stats);
//   } catch (error) {
//     console.error("Erreur lors de la récupération des stats horaires:", error);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// };

// GET /api/filevisits/hourly-stats/:pageName
exports.getHourlyStatsByPage = async (req, res) => {
  try {
    const { pageName } = req.params;

    if (!pageName) {
      return res.status(400).json({ message: "Nom de page manquant." });
    }

    const stats = await FileVisit.findAll({
      attributes: [
        [Sequelize.fn('HOUR', Sequelize.col('visitTime')), 'hour'], // Extraire l'heure depuis visitTime
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'visits'], // Nombre de visites par heure
        [Sequelize.fn('AVG', Sequelize.col('durationSeconds')), 'avgDuration'] // Durée moyenne
      ],
      where: { pageName },
      group: [Sequelize.fn('HOUR', Sequelize.col('visitTime'))], // Grouper par heure
      order: [[Sequelize.fn('HOUR', Sequelize.col('visitTime')), 'ASC']], // Trier par heure croissante
      raw: true,
    });

    res.json(stats);

  } catch (error) {
    console.error("Erreur récupération stats horaires :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des stats horaires." });
  }
};





