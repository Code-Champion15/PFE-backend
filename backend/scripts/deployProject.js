require("dotenv").config();
const path = require("path");
const runDockerBuild = require("./runDockerBuild");
const deployToVercel = require("./deployToVercel");

async function deployProject(userId, projectName) {
  try {
    console.log("Build en cours..");
    await runDockerBuild(userId, projectName);

    console.log("Déploiement sur Vercel..");
    const url = await deployToVercel(userId, projectName);

    console.log("Projet accessible ici :", url);
    return url;
  } catch (error) {
    console.error("Pipeline échoué :", error);
    throw error;
  }
}

// Exécution directe en CLI
if (require.main === module) {
  const [,, userId, projectName] = process.argv;
  if (!userId || !projectName) {
    console.error("❗ Utilisation : node deployProject.js <userId> <projectName>");
    process.exit(1);
  }

  deployProject(userId, projectName)
    .then(url => {
      console.log("🌐 URL finale :", url);
    })
    .catch(err => {
      console.error("❌ Erreur :", err);
    });
}

module.exports = deployProject;