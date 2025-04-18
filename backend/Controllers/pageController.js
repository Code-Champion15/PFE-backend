const Page = require('../Models/pageModel');
const Modification = require('../Models/modificationModel');
const { default: axios } = require('axios');

exports.createPage = async (req, res) => {
  try {
    const { name, content, parentId, route } = req.body;
    const userId = req.user?.id || null;
    const userName = req.user ? req.user.username : "Inconnu";

    const newPage = await Page.create({ name, content, parentId, route });

    await Modification.create({
      operationType: "creation",
      userId,
      userName,
      pageId: newPage.id,
      pageName: newPage.name,
      oldContent: null,
      newContent: newPage.content,

    });
    res.status(201).json({ message : "Page crée avec succes", page: newPage});
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la page', error: error.message });
  }
};

// exports.generatePageFromPrompt = async (req, res) => {
//   const { prompt } = req.body;
//   console.log("Backend - Prompt reçu :", prompt);

//   if (!prompt) {
//     return res.status(400).json({ message: "Prompt manquant" });
//   }

//   try {
//     const response = await axios.post("https://sultan-api-zrhp.onrender.com/generate", {
//       prompt,
//     }, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     console.log("Backend - Réponse IA :", JSON.stringify(response.data, null, 2));
//     res.status(200).json({ content: response.data });
//   } catch (error) {
//     console.error("Backend - Erreur API IA :", error.message);
//     res.status(500).json({ message: "Erreur lors de l’appel à l’IA", error: error.message });
//   }
// };

exports.getPages = async (req, res) => {
  try {
    const pages = await Page.findAll();
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des pages', error });
  }
};

 exports.getPageById = async (req, res) => {
   try{
     const {id} = req.params;
     console.log(`backend: Recuperation de la page avec ID: ${id}`);
     const page = await Page.findByPk(id);
     if (!page) {
       console.log("backend: page non trouvé");
       return res.status(404).json({message: "Page non trouvée"});
     }
     console.log("Backend : Page trouvée:", page);

     const content = typeof page.content === "string" ? JSON.parse(page.content) : page.content;
     return res.json({ ...page.toJSON(), content });

   } catch (error) {
     console.error("Backend erreur lors de la recuperation de la page:",error);
     return res.status(500).json({message: "Erreur serveur", error});
   }
 };

exports.updatePage = async (req, res) => {
  try {
    const { name, content } = req.body;
    const page = await Page.findByPk(req.params.id);
    if (page) {
      page.name = name || page.name;
      page.content = content || page.content;
      await page.save();
      res.status(200).json(page);
    } else {
      res.status(404).json({ message: 'Page non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la page', error });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (page) {
      await page.destroy();
      res.status(200).json({ message: 'Page supprimée' });
    } else {
      res.status(404).json({ message: 'Page non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la page', error });
  }
};

exports.getAllPagesWithChildren = async (req, res) => {
  try {
    const pages = await Page.findAll({
      where: { parentId: null },
      include: [{ model: Page, as: "Children" }],
    });

    if (!pages || pages.length === 0) {
      return res.status(404).json({ message: "Aucune page trouvée" });
    }

    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


exports.getPageByRoute = async (req, res) => {
  try {
    const { route } = req.params;
    const page = await Page.findOne({ where: { route } });

    if (!page) return res.status(404).json({ message: "Page non trouvée" });

    // Vérifier que le contenu est bien un JSON parsable
    let parsedContent;
    try {
      parsedContent = JSON.parse(page.content);
    } catch (error) {
      return res.status(500).json({ message: "Erreur de parsing du JSON", error });
    }

    res.json({
      id: page.id,
      name: page.name,
      route: page.route,
      content: parsedContent, // Renvoie le JSON sous forme d'objet
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


exports.getContentById = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page non trouvée.' });
    }
    res.status(200).json({ content: page.content });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du contenu de la page.', error });
  }
};

exports.getContentByRoute = async (req, res) => {
  try {
    const { route } = req.params;
    const page = await Page.findOne({ where: { route } });

    if (!page) {
      return res.status(404).json({ message: "Page non trouvée" });
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(page.content);
    } catch (error) {
      return res.status(500).json({ message: "Erreur de parsing du JSON", error });
    }

    res.json(parsedContent);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updatePageContent = async (req, res) => {
  try{
    const {id} = req.params;
    const {content} = req.body;
    const userId = req.user?.id || null;
    const userName = req.user ? req.user.username : "Inconnu";

    console.log(`Backend : Mise a jour de la page avec l id : ${id}`);
    console.log("Nouveau contenu recu:", JSON.stringify(content, null, 2));
    
    const page = await Page.findByPk(id);    
    if (!page) {
      console.log("backend: page non trouvé");
      return res.status(404).json({massage: "Page non trouvé"});
    }
    const oldContent = page.content;
    const newContent = typeof content === "string" ? content : JSON.stringify(content, null, 0);
    
    await page.update({ content:newContent });

    await Modification.create({
      operationType: "modification",
      userId,
      userName,
      pageId: page.id,
      pageName: page.name,
      oldContent,
      newContent,
    });

    console.log("backend: page mis a jour avec succes");
    return res.json({ message: "Page mise a jour avec succes", page});
  } catch (error) {
    console.error("backend : erreur lors de la mis a jour de la page", error);
    return res.status(500).json({ message: "erreur serveur", error: error.message});
  }
};

// exports.getModificationHistory = async (req, res) => {
//   try{
//     const history = await Modification.findAll({
//       order: [["createdAt", "DESC"]],
//     });
//     return res.json(history);
//   } catch (error) {
//     console.error("Backend : erreur lors de la recuperation de l historique", error);
//     return res.status(500).json({ massage: "Erreur serveur", error: error.message});
//   }
// };

exports.getPageList = async (req, res) => {
  try {
    const pages = await Page.findAll({
      attributes: ['route', 'name']
    });
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des pages', error });
  }
};

// exports.getPageById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(`backend: Récupération de la page avec ID: ${id}`);

//     const page = await Page.findByPk(id);
//     if (!page) {
//       console.log("backend: Page non trouvée");
//       return res.status(404).json({ message: "Page non trouvée" });
//     }
//     console.log("Backend : Page trouvée:", page);

//     // Vérification et gestion du contenu vide ou null
//     let content = page.content;
//     if (content) { // Si content n'est pas null ou vide
//       if (typeof content === "string") {
//         try {
//           content = JSON.parse(content); // Essayer de parser le contenu si c'est une chaîne
//         } catch (parseError) {
//           console.error("Erreur de parsing JSON pour le contenu de la page:", parseError);
//           return res.status(400).json({ message: "Le contenu de la page est mal formé" });
//         }
//       }
//     } else {
//       console.log("Backend : Le contenu est vide ou null");
//       content = ""; // Assurez-vous que content est un objet vide ou une structure par défaut
//     }

//     return res.json({ ...page.toJSON(), content });
//   } catch (error) {
//     console.error("Backend erreur lors de la récupération de la page:", error);
//     return res.status(500).json({ message: "Erreur serveur", error: error.message });
//   }
// };


