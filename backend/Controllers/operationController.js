const Operation = require('../Models/operationModel');

exports.getAllOperations = async (req, res) => {
  try {
    const operations = await Operation.findAll({
      order: [['createdAt', 'DESC']], 
    });
    res.json(operations);
  } catch (error) {
    console.error('Erreur lors de la récupération des opérations:', error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des opérations." });
  }
};

exports.getMyOperations = async (req, res) => {
  try {
    const userId = req.user.id; 

    const myOperations = await Operation.findAll({
      where: { userId: userId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(myOperations);
  } catch (error) {
    console.error("Erreur lors de la récupération des opérations utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};