const Avis = require("../Models/avis");
const User = require("../Models/userModel");

exports.createAvis = async (req, res) => {
  const { note, commentaire } = req.body;
  const userId = req.user.id;

  if (!note) return res.status(400).json({ message: "Note obligatoire." });

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    const nouvelAvis = await Avis.create({
      userId,
      username: user.username || user.email,
      note,
      commentaire,
    });

    res.status(201).json(nouvelAvis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getAllAvis = async (req, res) => {
  try {
    const avis = await Avis.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(avis);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des avis." });
  }
};
