require("dotenv").config();
const path = require("path");
const fs = require("fs-extra");
const runDockerBuild = require("./runDockerBuild");
const deployToVercel = require("./deployToVercel");

async function deployProject(userId, projectName) {
    const buildPath = path.join(__dirname, "../outputs", `user_${userId}`, projectName);
    try {
        //etape 1
        console.log('Supression de l ancien build s il existe');
         await fs.remove(buildPath).catch(err => {
            console.error("Échec suppression du dossier :", buildPath, err);
        });

        console.log("Build en cours..");
        await runDockerBuild(userId, projectName);

        console.log("Déploiement sur Vercel..");
        const url = await deployToVercel(userId, projectName);

        //Etape 6
        await fs.remove(buildPath).catch(err => {
            console.error("Échec suppression du dossier :", buildPath, err);
        });

        console.log("Projet accessible ici :", url);
        return url;
    } catch (error) {
        console.error("Pipeline échoué :", error);
        throw error;
    }
}
// Exécution directe en CLI
if (require.main === module) {
    const [, , userId, projectName] = process.argv;
    if (!userId || !projectName) {
        console.error(" Utilisation : node deployProject.js <userId> <projectName>");
        process.exit(1);
    }

    deployProject(userId, projectName)
        .then(url => {
            console.log(" URL finale :", url);
        })
        .catch(err => {
            console.error("Erreur :", err);
        });
}

module.exports = deployProject;