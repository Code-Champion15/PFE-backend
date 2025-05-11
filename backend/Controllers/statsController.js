const User = require('../Models/userModel');
const Projet = require('../Models/projet');
const Operation = require('../Models/operationModel');
const Avis = require('../Models/avis');
const Connexion = require('../Models/connexion');
const { Op } = require('sequelize');
const sequelize = require('sequelize'); 

exports.getDashboardStats = async (req, res) => {
  try {
    console.log('Récupération des statistiques...');

    const totalUsers = await User.count();
    console.log('Total utilisateurs:', totalUsers);

    const totalProjects = await Projet.count();
    console.log('Total projets:', totalProjects);

    const totalAvis = await Avis.count();
    console.log('Total avis:', totalAvis);

    const averageNote = await Avis.aggregate('note', 'avg');
    console.log('Note moyenne des avis:', averageNote);

    const today = new Date();
    const last7Days = new Date(today.setDate(today.getDate() - 6));

    console.log('Date limite des 7 derniers jours:', last7Days);

    const logins = await Connexion.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('timestamp')), 'day'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        timestamp: { [Op.gte]: last7Days }
      },
      group: [sequelize.fn('DATE', sequelize.col('timestamp'))]
    });

    console.log('Connexions par jour (7 derniers jours):', logins);

    const operations = await Operation.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'day'],
        'operationType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: { [Op.gte]: last7Days }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt')), 'operationType']
    });

    console.log('Opérations par jour (7 derniers jours):', operations);

    res.status(200).json({
      totalUsers,
      totalProjects,
      totalAvis,
      averageNote,
      logins,
      operations
    });
  } catch (err) {
    console.error("Erreur dans la récupération des statistiques:", err);
    res.status(500).json({ error: 'Erreur serveur', details: err });
  }
};
