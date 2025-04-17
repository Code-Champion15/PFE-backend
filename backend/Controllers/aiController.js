const { default: axios } = require('axios');

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