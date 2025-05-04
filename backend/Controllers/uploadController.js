const multer = require('multer');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');

const Projet = require('../Models/projet');

const {setActiveProjectPath} = require('../utils/projectPathHelper');
const uploadPath = path.join(__dirname, '../uploads/projects');

// Crée le dossier upload s’il n’existe pas
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
// Configuration multer pour les fichiers ZIP
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${safeName}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 1000 * 1024 * 1024 } });

// Middleware d'upload
exports.uploadMiddleware = upload.single('projectZip');

// Traitement du zip après upload
exports.handleUpload = async (req, res) => {
  const file = req.file;

  const userId = req.user?.id|| null;
  const username = req.user?.username || "inconnu";

  if (!file) return res.status(400).json({ error: "Fichier non fourni." });

  //const extractDir = path.join(uploadPath, path.parse(file.filename).name);
  const projectName = path.parse(file.filename).name;
  const userDir = path.join(__dirname, '../uploads', `user_${userId}`);
  const projectDir = path.join(userDir, 'projects')
  const extractDir = path.join(projectDir, projectName);
// Créer les dossiers si nécessaires
fs.mkdirSync(projectDir, { recursive: true });

  try {
    // Extraction du zip
    await fs.createReadStream(file.path)
      .pipe(unzipper.Extract({ path: extractDir }))
      .promise();

    // Supprimer le fichier zip après extraction (optionnel mais propre)
    fs.unlinkSync(file.path);

    // Vérification que le dossier src/pages existe
         const pagesFolder = path.join(extractDir, 'src', 'pages');
         if (!fs.existsSync(pagesFolder)) {
          return res.status(400).json({ error: "Le dossier 'src/pages' est manquant dans le projet." });
         }

    // Enregistrer dynamiquement le chemin du projet
    setActiveProjectPath(extractDir);

    const createdProject = await Projet.create({
      name: projectName,
      path: extractDir, 
      uploadedBy: username,
      userId: userId,
    });

    res.json({ message: "Projet uploadé avec succès et dossier 'src/pages' détecté." });
  } catch (error) {
    console.error("Erreur traitement projet:", error);
    res.status(500).json({ error: "Erreur lors du traitement du projet." });
  }
};
