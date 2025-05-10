const fs = require('fs');
const path = require('path');
const File = require('../Models/file');
const { default: axios } = require('axios');
const Operation = require('../Models/operationModel');
const { getPagesPath, getProjectDetails } = require('../utils/projectPathHelper');
const { updateRoutesFile } = require('../utils/routeUpdater');
const Projet = require('../Models/projet');

//liste les noms des fichiers du dossier pages
exports.listPages = async (req, res) => {
  try {
    const userId = req.user?.id;
    const pagesPath = await getPagesPath(userId);
    console.log(pagesPath);

    if (!pagesPath || !fs.existsSync(pagesPath)) {
      return res.status(404).json({ error: "Dossier pages introuvable" });
    }

    const files = fs.readdirSync(pagesPath);
    const jsFiles = files.filter(f => f.endsWith(".js"));
    res.json(jsFiles.map(f => f.replace(".js", "")));

  } catch (error) {
    console.error("Erreur dans listPages:", error);
    res.status(500).json({ error: "Erreur lecture dossier" });
  }
};
//lit le code d'un ficher 
exports.readPage = async (req, res) => {
  const pagesPath = await getPagesPath(req.user.id);
  const filePath = path.join(pagesPath, `${req.params.pageName}.js`);  
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Fichier non trouvé' });

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erreur lecture fichier' });
    res.json({ content: data });
  });
};

exports.updatePage = async (req, res) => {
  const pagesPath = await getPagesPath(req.user.id);
  const filePath = path.join(pagesPath, `${req.params.pageName}.js`);
  const { content } = req.body;

  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Fichier non trouvé' });

  fs.writeFile(filePath, content, (err) => {
    if (err) return res.status(500).json({ error: 'Erreur écriture fichier' });
    res.json({ success: true, message: 'Fichier mis à jour avec succès' });
  });

};

//sauvegarde apres modif
exports.savePageCode = async (req, res) => {
  const { pageName, code } = req.body;
  const userId = req.user?.id || null;
  const userName = req.user?.username || "Inconnu";

  if (!pageName || !code) {
    return res.status(400).json({ error: 'Nom de la page ou code manquant.' });
  }

  //const pagesPath = await getPagesPath(userId);
  const projectDetails = await getProjectDetails(userId);
  if (!projectDetails) {
    return res.status(400).json({ error: 'Aucun projet actif trouvé pour cet utilisateur.' });
  }

  const { projectId, path: projectPath } = projectDetails;
  //const filePath = path.join(pagesPath, `${pageName}.js`);
  const filePath = path.join(projectPath, "src", "pages", `${pageName}.js`);
  fs.writeFile(filePath, code, 'utf8', async (err) => {
    if (err) {
      console.error('Erreur lors de la sauvegarde du fichier:', err);
      return res.status(500).json({ error: 'Erreur lors de la sauvegarde du fichier.' });
    }
   try{
      await Operation.create({
        operationType: 'modification',
        userId: userId,
        username: userName,
        fileName: `${pageName}.js`,
        projectId: projectId,
      });
    return res.json({ message: 'Code mis à jour avec succès et operation enregistré !' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'opération:', error);
    return res.status(500).json({ error: 'Code mis à jour mais erreur lors de l\'enregistrement de l\'opération.' });
  }
  });
};

//pour la modification
exports.generateCode = async (req, res) => {
  const { prompt } = req.body;
  console.log("Reçu pour génération IA:", {prompt});

  if (!prompt) {
    return res.status(400).json({ error: 'Le prompt est requis.' });
  }
  try {
    // Appeler l'API du modèle pour générer le code à partir du prompt
    const response = await axios.post('https://coder-api.onrender.com/generate', { prompt });

    const generatedCode = response.data.code;

    if (!generatedCode) {
      return res.status(500).json({ error: 'Aucun code généré par l\'IA.' });
    }

    return res.json({ code: generatedCode });
  } catch (err) {
    console.error('Erreur lors de la génération du code:', err);
    return res.status(500).json({ error: 'Erreur lors de la génération du code.' });
  }
};


exports.createFile = async (req, res) => {
  const { pageName, code, projectId } = req.body;
  const userId = req.user?.id ;
  console.log("Utilisateur connecté :", userId); 
  const userName = req.user?.username || "Inconnu";

  if (!pageName || !code || !projectId) {
    return res.status(400).json({ error: 'pageName et code sont requis' });
  }
  const pageDir = await getPagesPath(userId);
  const filePath = path.join(pageDir, `${pageName}.js`);
  console.log("Chemin final du fichier :", filePath);

  try {
    fs.mkdirSync(pageDir, { recursive: true });
    fs.writeFileSync(filePath, code);

    //l ajout de la route:
    updateRoutesFile(pageName, userId);

    await File.create({
      fileName: `${pageName}.js`,
      route: `/pages/${pageName}`,  
      userId: userId,
      username: userName,
      projectId: projectId,

    });

    await Operation.create({
      operationType: 'creation',
      userId: userId,
      username: userName,
      fileName: `${pageName}.js`,
      projectId: projectId,
    });

    res.status(200).json({ message: 'Page créée avec succès.' });
  } catch (err) {
    console.error('Erreur création fichier :', err);
    res.status(500).json({ error: 'Erreur lors de la création de la page.' });
  }
};

exports.listFormattedPages = async (req, res) => {
  try{
  const pagesPath = await getPagesPath(req.user.id);

    const files = fs.readdirSync(pagesPath);

    const jsFiles = files.filter(f => f.endsWith('.js'));

    const formattedFiles = jsFiles.map(f => {
      const fileNameWithoutExt = f.replace('.js', '');
      return {
        name: fileNameWithoutExt.charAt(0).toUpperCase() + fileNameWithoutExt.slice(1),
        route: `/${fileNameWithoutExt.toLowerCase()}`
      };
    });

    res.json(formattedFiles);
  }catch (err) {
    console.error("Erreur listFormattedPages:", err);
    res.status(500).json({ error: "Erreur lecture dossier." });
  }
};



