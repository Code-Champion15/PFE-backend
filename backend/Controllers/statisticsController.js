const PageVisit = require("../Models/pageVisitModel");
const { Op, fn, col, Sequelize } = require("sequelize");

// Pour utiliser "sequelize.fn", on peut récupérer l'instance Sequelize depuis le modèle
const sequelizeInstance = PageVisit.sequelize;

// Enregistrer une visite
exports.trackVisit = async (req, res) => {
  try {
    const { pageRoute, startTime, endTime, userId } = req.body;
    const durationSeconds = Math.floor((new Date(endTime) - new Date(startTime)) / 1000);
    const visitDate = new Date(startTime).toISOString().split("T")[0];

    await PageVisit.create({
      pageRoute,
      visitDate,
      visitTime: new Date(startTime),
      durationSeconds,
      userId: userId || null,
    });

    res.status(201).json({ message: "Visite enregistrée" });
  } catch (error) {
    console.error("Erreur enregistrement visite:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer les statistiques agrégées par jour pour une page
exports.getStatsByPage = async (req, res) => {
  try {
    const { pageRoute } = req.query;
    // Agrégation : nombre de visites et durée moyenne par date
    const stats = await PageVisit.findAll({
      where: { pageRoute },
      attributes: [
        // On utilise le champ visitDate pour grouper
        "visitDate",
        [fn("COUNT", "*"), "visits"],
        [fn("AVG", col("durationSeconds")), "avgDuration"],
      ],
      group: ["visitDate"],
      order: [["visitDate", "ASC"]],
    });

    res.json(stats);
  } catch (error) {
    console.error("Erreur récupération stats:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getAllStats = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Initialiser la clause where vide
      let whereClause = {};
  
      // Si les deux dates sont fournies, ajouter une condition sur le champ visitDate
      if (startDate && endDate) {
        whereClause.visitDate = {
          [Op.between]: [startDate, endDate],
        };
      }
  
      const stats = await PageVisit.findAll({
        attributes: [
          "pageRoute",
          [fn("COUNT", "*"), "visits"],
          [fn("AVG", col("durationSeconds")), "avgDuration"],
        ],
        where: whereClause,
        group: ["pageRoute"],
        order: [["pageRoute", "ASC"]],
      });
  
      res.json(stats);
    } catch (error) {
      console.error("Erreur récupération stats globales:", error);
      res.status(500).json({ error: "Erreur serveur lors de la récupération des statistiques globales." });
    }
  };

  exports.getHourlyStatsByPage = async (req, res) => {
    try {
      const { pageRoute } = req.query;
  
      const stats = await PageVisit.findAll({
        where: { pageRoute },
        attributes: [
          [sequelizeInstance.fn('HOUR', sequelizeInstance.col('visitTime')), 'hour'],
          [sequelizeInstance.fn('COUNT', '*'), 'visits'],
          [sequelizeInstance.fn('AVG', sequelizeInstance.col('durationSeconds')), 'avgDuration']
        ],
        group: ['hour'],
        order: [[sequelizeInstance.fn('HOUR', sequelizeInstance.col('visitTime')), 'ASC']]
      });
  
      res.status(200).json(stats);
    } catch (error) {
      console.error("Erreur lors de la récupération des stats horaires:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };
