const { default: axios } = require('axios');
//modification api ia
exports.generatePageFromPrompt = async (req, res) => {
    const { prompt } = req.body;
    console.log("Backend - Prompt reçu :", prompt);
    if (!prompt) {
      return res.status(400).json({ message: "Prompt manquant" });
    }
    try {
      const response = await axios.post("https://sultan-api-zrhp.onrender.com/generate", {
        prompt,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Backend - Réponse IA :", JSON.stringify(response.data, null, 2));
      res.status(200).json({ content: response.data });
    } catch (error) {
      console.error("Backend - Erreur API IA :", error.message);
      res.status(500).json({ message: "Erreur lors de l’appel à l’IA", error: error.message });
    }
  };

// Fonction pour générer du code via l'API de l'IA (creation)
exports.generateCode = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Le prompt est requis' });
  }
  try {
    const response = await axios.post('https://creation-ai-api.onrender.com/generate', {
      prompt: prompt,
    });
    res.status(200).json({ code: response.data.code });
  } catch (error) {
    console.error('Erreur lors de la génération du code par l’IA:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du code par l’IA' });
  }
};


  ////new startegy modification
   // controllers/aiController.js
const { FileHistory } = require("../Models");
const fs = require("fs");
const path = require("path");

const pagesDir = path.join(__dirname, '../../frontend/PFE-frontend/src/pages');

exports.generateEdit = async (req, res) => {
  const { fileName, fileContent, instruction } = req.body;
  if (!fileName || !fileContent || !instruction) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  try {
    // Prépare le prompt pour l'IA
    const systemPrompt = `
Tu es un assistant expert React. 
Voici le code du composant **${fileName}.js** :
----------------------------------------
${fileContent}
----------------------------------------
Instruction : ${instruction}
Renvoie **uniquement** le code complet modifié du composant.
`;

    // Appel à l’API IA (ex : Qwen2.5)
    const aiRes = await axios.post(
      "https://sultan-api-zrhp.onrender.com/generate",
      { systemMessage: systemPrompt },
      { headers: { "Content-Type": "application/json" } }
    );
    const newCode = aiRes.data.generatedCode;
    if (!newCode) throw new Error("IA n’a pas renvoyé de code");

    // Retourne le nouveau code brut pour prévisualisation
    res.json({ newCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur IA" });
  }
};

exports.saveEdit = async (req, res) => {
  const { fileName, oldCode, newCode, instruction } = req.body;
  if (!fileName || oldCode == null || newCode == null || !instruction) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  const filePath = path.join(pagesDir, `${fileName}.js`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Fichier non trouvé" });
  }

  try {
    // Sauvegarde physique
    fs.writeFileSync(filePath, newCode, "utf-8");

    // Historisation
    await FileHistory.create({
      fileName,
      prompt: instruction,
      oldCode,
      newCode,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Échec de la sauvegarde" });
  }
};
