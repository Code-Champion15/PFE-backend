const Projet = require('../Models/projet');
const deployProject = require("../scripts/deployProject");

exports.deployProject = async (req, res) => {
  const { userId, projectName } = req.body;

   if (!userId || !projectName) {
    return res.status(400).json({ error: "userId et projectName requis." });
  }
  try {
    // 1. Mettre à jour le statut à "pending"
    await Projet.update(
      { deploymentStatus: "pending" },
      { where: { userId, name: projectName } }
    );
    const vercelUrl = await deployProject(userId, projectName);
    await Projet.update(
      { vercelUrl, deploymentStatus: "success" },
      { where: { userId, name: projectName } }
    );
    res.json({ success: true, url: vercelUrl });
  } catch (error) {
    console.error("Erreur de déploiement :", error);
    await Projet.update(
      { deploymentStatus: "error" },
      { where: { userId, name: projectName } }
    );
    res.status(500).json({ error: "Déploiement échoué", details: error.message });
  }
};