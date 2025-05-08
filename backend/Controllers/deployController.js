const runDockerBuild = require("../scripts/runDockerBuild"); // Import du script Docker

// Contrôleur pour démarrer le build du projet React
exports.deployProject = async (req, res) => {
  const { userId, projectName } = req.body;

  if (!userId || !projectName) {
    return res.status(400).json({ message: "UserId et ProjectName sont requis." });
  }

  try {
    const outputPath = await runDockerBuild(userId, projectName);

    res.status(200).json({
      message: "Build réussi",
      outputPath,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du build du projet.",
      error: error.message,
    });
  }
};
