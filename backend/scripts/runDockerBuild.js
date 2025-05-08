const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Fonction pour builder un projet React dans un conteneur Docker isolé
async function runDockerBuild(userId, projectName) {
  console.log("🚀 Script lancé !");
  
  // Utilisation de path.resolve() pour obtenir des chemins absolus à partir du répertoire de travail
  const projectPath = path.resolve(__dirname, `../uploads/user_${userId}/projects/${projectName}`);
  const outputPath = path.resolve(__dirname, `../outputs/user_${userId}/${projectName}`);

  // Vérifier que le dossier projet existe
  if (!fs.existsSync(projectPath)) {
    console.error(`❌ Le dossier projet n'existe pas : ${projectPath}`);
    return;
  }

  // Créer le dossier de sortie s'il n'existe pas
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
    console.log(`📁 Dossier de sortie créé : ${outputPath}`);
  }

  // Nom d'image Docker
  const imageName = `react-builder-user${userId}-${projectName}`.toLowerCase();

  // Remplacer les backslashes Windows par des slashes pour Docker
  const dockerProjectPath = projectPath.replace(/\\/g, '/');
  const dockerOutputPath = outputPath.replace(/\\/g, '/');

  // Commande pour builder l'image avec --build-arg
  const buildCmd = `docker build -f docker/Dockerfile.react-builder -t ${imageName} --build-arg PROJECT_PATH=uploads/user_${userId}/projects/${projectName} .`;

  // Commande pour exécuter le conteneur et extraire le build
  const runCmd = `docker run --rm -v "${dockerOutputPath}:/output" ${imageName}`;

  console.log("🔧 Build command:", buildCmd);
  console.log("📦 Run command:", runCmd);

  // Lancer la construction Docker
  return new Promise((resolve, reject) => {
    exec(buildCmd, (buildErr, buildStdout, buildStderr) => {
      if (buildErr) {
        console.error("❌ Build échoué :", buildStderr);
        return reject(buildStderr);
      }

      console.log("✅ Build réussi !");
      exec(runCmd, (runErr, runStdout, runStderr) => {
        if (runErr) {
          console.error("❌ Docker run échoué :", runStderr);
          return reject(runStderr);
        }

        console.log("📁 Build extrait dans :", outputPath);
        resolve(outputPath);
      });
    });
  });
}

// Exécution directe via CLI
if (require.main === module) {
  const [,, userId, projectName] = process.argv;

  if (!userId || !projectName) {
    console.error("🛠️ Utilisation : node runDockerBuild.js <userId> <projectName>");
    process.exit(1);
  }

  runDockerBuild(userId, projectName)
    .then(() => {
      console.log("🎉 Terminé avec succès !");
    })
    .catch(err => {
      console.error("❌ Erreur :", err);
    });
}

module.exports = runDockerBuild;
