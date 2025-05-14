require("dotenv").config();
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

async function deployToVercel(userId, projectName) {
  const buildPath = path.resolve(__dirname, `../outputs/user_${userId}/${projectName}`);
  const token = process.env.VERCEL_TOKEN;

  if (!token) {
    throw new Error("VERCEL_TOKEN non défini dans les variables d'environnement");
  }
  if (!fs.existsSync(buildPath)) {
    throw new Error(`Dossier build introuvable : ${buildPath}`);
  }
  return new Promise((resolve, reject) => {
    const cmd = `vercel deploy ${buildPath} --prod --token=${token} --confirm`;

    console.log("Déploiement en cours avec la commande :", cmd);

    exec(cmd, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
      if (error) {
        console.error("Erreur lors du déploiement :", stderr);
        return reject(stderr);
      }
      const urlMatch = stdout.match(/https?:\/\/[^\s]+\.vercel\.app/);
      const deployedUrl = urlMatch ? urlMatch[0] : null;

      if (deployedUrl) {
        console.log("Projet déployé à :", deployedUrl);
        resolve(deployedUrl);
      } else {
        reject("URL de déploiement introuvable");
      }
    });
  });
}
// Exécution CLI directe
if (require.main === module) {
  const [,, userId, projectName] = process.argv;
  deployToVercel(userId, projectName)
    .then((url) => console.log(" URL déployée :", url))
    .catch((err) => console.error(err));
}
module.exports = deployToVercel;
