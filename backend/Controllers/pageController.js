const Page = require('../Models/pageModel');


exports.createPage = async (req, res) => {
  try {
    const { name, generatedCode } = req.body;
    const newPage = await Page.create({ name, generatedCode });
    res.status(201).json(newPage); 
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la page', error });
  }
};

exports.getPages = async (req, res) => {
  try {
    const pages = await Page.findAll(); 
    res.status(200).json(pages); 
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des pages', error });
  }
};

exports.getPageById = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id); 
    if (page) {
      res.status(200).json(page); 
    } else {
      res.status(404).json({ message: 'Page non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la page', error });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { name, generatedCode } = req.body;
    const page = await Page.findByPk(req.params.id);
    if (page) {
      page.name = name || page.name;
      page.generatedCode = generatedCode || page.generatedCode;
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
