const fs = require('fs');
const path = require('path');
const File = require('../Models/file');
const { default: axios } = require('axios');
const Operation = require('../Models/operationModel');
const { getPagesPath } = require('../utils/projectPathHelper');
const { updateRoutesFile } = require('../utils/routeUpdater');

//const pagesPath = path.join(__dirname, '../../frontend/PFE-frontend/src/pages');

//liste les noms des fichiers du dossier pages
exports.listPages = (req, res) => {
  fs.readdir(getPagesPath() , (err, files) => {
    console.log("Fichiers trouvés :", files);
    console.log("Chemin résolu vers les pages :", getPagesPath());
    if (err) return res.status(500).json({ error: 'Erreur lecture dossier' });
    const jsFiles = files.filter(f => f.endsWith('.js'));
    res.json(jsFiles.map(f => f.replace('.js', '')));
  });
};

//lit le code d'un ficher 
exports.readPage = (req, res) => {
  const filePath = path.join(getPagesPath(), `${req.params.pageName}.js`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Fichier non trouvé' });

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erreur lecture fichier' });
    res.json({ content: data });
  });
};

exports.updatePage = (req, res) => {
  const filePath = path.join(getPagesPath(), `${req.params.pageName}.js`);
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

  const filePath = path.join(getPagesPath(), `${pageName}.js`);
  
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
  const { pageName, code } = req.body;
  const userId = req.user?.id || null;
  const userName = req.user?.username || "Inconnu";

  if (!pageName || !code) {
    return res.status(400).json({ error: 'pageName et code sont requis' });
  }
  //const pageDir = path.join(__dirname, '../../frontend/PFE-frontend/src/pages');
  const pageDir = getPagesPath();
  const filePath = path.join(pageDir, `${pageName}.js`);
  console.log("Chemin final du fichier :", filePath);

  try {
    fs.mkdirSync(pageDir, { recursive: true });
    fs.writeFileSync(filePath, code);

    //l ajout de la route:
    updateRoutesFile(pageName);

    await File.create({
      fileName: `${pageName}.js`,
      route: `/pages/${pageName}`,  
      userId: userId,
      username: userName,

    });

    await Operation.create({
      operationType: 'creation',
      userId: userId,
      username: userName,
      fileName: `${pageName}.js`,
    });

    res.status(200).json({ message: 'Page créée avec succès.' });
  } catch (err) {
    console.error('Erreur création fichier :', err);
    res.status(500).json({ error: 'Erreur lors de la création de la page.' });
  }
};

exports.listFormattedPages = (req, res) => {
  fs.readdir(getPagesPath(), (err, files) => {
    if (err) {
      console.error("Erreur lecture dossier pages :", err);
      return res.status(500).json({ error: "Erreur lecture dossier." });
    }

    const jsFiles = files.filter(f => f.endsWith('.js'));

    const formattedFiles = jsFiles.map(f => {
      const fileNameWithoutExt = f.replace('.js', '');
      return {
        name: fileNameWithoutExt.charAt(0).toUpperCase() + fileNameWithoutExt.slice(1),
        route: `/${fileNameWithoutExt.toLowerCase()}`
      };
    });

    res.json(formattedFiles);
  });
};



