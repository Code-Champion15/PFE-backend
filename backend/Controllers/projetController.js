const Projet = require('../Models/projet');
const { setActiveProjectPath } = require('../utils/projectPathHelper');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const fsExtra = require('fs-extra');

exports.listProjects = async (req, res) => {
  try {
    const projets = await Projet.findAll({
      attributes: ['id', 'name', 'path', 'uploadedBy', 'createdAt']
    });
    res.json(projets);
  } catch (error) {
    console.error("Erreur lors de la recuperation des projets: ", error);
    res.status(500).json({ error: " Erreur lors de la recuperation des projets" });
  }

};

exports.setActiveProject = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.body;

    const projet = await Projet.findOne({ where: { id: projectId, userId } });
    if (!projet) return res.status(404).json({ error: "Projet introuvable." });

    await Projet.update({ isActive: false }, { where: { userId } });
    await projet.update({ isActive: true });

    if (!projet.path) {
      return res.status(400).json({ error: "Ce projet n'a pas de chemin défini" });
    }

    setActiveProjectPath(projet.path);
    res.json({ message: "Projet défini comme actif.", projet });

  } catch (error) {
    console.error("Erreur dans setActiveProject :", error);
    res.status(500).json({ error: "Erreur interne serveur." });
  }
};


//getProjects : liste les projets de l utilisateur
exports.getUserProjects = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Non authentifié" })

  try {
    const projets = await Projet.findAll({ where: { userId } });
    res.status(200).json({ projets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des projets." });
  }
};

//   exports.getActiveProject = async (req, res) => {
//     const userId = req.user?.id;

//     try {
//       const active = await ActiveProject.findOne({ where: { userId } });
//       if (!active) return res.status(404).json({ error: "Aucun projet actif." });

//       const project = await Project.findByPk(active.projectId);
//       res.status(200).json(project);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Erreur lors de la récupération du projet actif." });
//     }
//   };

// GET /api/projects/active - Retourne le projet actif
exports.getActiveProject = async (req, res) => {
  const userId = req.user?.id;
  const projet = await Projet.findOne({ where: { userId, isActive: true } });

  if (!projet) return res.status(404).json({ error: "Aucun projet actif." });
  res.json({ projet });
};

exports.downloadProject = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.params;
    const projet = await Projet.findOne({ where: { id: projectId, userId } });

    if (!projet) return res.status(404).json({ error: "Projet introuvable" });

    const projectPath = projet.path;
    if (!projectPath) return res.status(400).json({ error: "Le projet n'a pas de chemin défini." });

    const zipFileName = `project_${projectId}.zip`;
    const zipPath = path.join(__dirname, `../../uploads/${zipFileName}`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on('error', (err) => {
      console.error("Erreur d'archivage :", err);
      return res.status(500).json({ error: "Erreur lors de la création de l'archive." });
    });

    archive.pipe(output);
    archive.directory(projectPath, false);
    archive.finalize();

    output.on("close", () => {
      res.download(zipPath, zipFileName, (err) => {
        if (err) {
          console.error("Erreur lors du téléchargement :", err);
          return res.status(500).json({ error: "Erreur lors du téléchargement." });
        }

        fs.unlink(zipPath, (unlinkErr) => {
          if (unlinkErr) console.error("Erreur lors de la suppression du zip :", unlinkErr);
        });

        res.on("finish", async () => {
          try {
            // Supprimer uniquement le dossier projet
            await fsExtra.remove(projectPath);
            console.log("Dossier projet supprimé après téléchargement.");
            // Supprimer le projet de la BDD
            await Projet.destroy({ where: { id: projectId } });
          } catch (cleanupErr) {
            console.error("Erreur lors de la suppression du dossier projet :", cleanupErr);
          }
        });


      });
    });
  } catch (error) {
    console.error("Erreur dans downloadProject :", error);
    res.status(500).json({ error: "Erreur interne serveur." });
  }
};