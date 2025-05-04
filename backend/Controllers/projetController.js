const Projet = require('../Models/projet');
const {setActiveProjectPath} = require('../utils/projectPathHelper');

exports.listProjects = async (req,res) => {
    try{
        const projets = await Projet.findAll({
            attributes: ['id', 'name', 'path', 'uploadedBy', 'createdAt']
        });
        res.json(projets);
    } catch (error){
        console.error("Erreur lors de la recuperation des projets: ", error);
        res.status(500).json({ error:" Erreur lors de la recuperation des projets"});
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
    if(!userId) return res.status(401).json({error:"Non authentifié"})
  
    try {
      const projets = await Projet.findAll({ where: { userId } });
      res.status(200).json({projets});
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
  
