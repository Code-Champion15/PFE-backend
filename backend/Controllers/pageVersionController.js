const { PageVersion, Page, Modification } = require("../Models");

exports.getVersions = async (req, res) => {
  try {
    const versions = await PageVersion.findAll({
      where: { pageId: req.params.id },
      order: [['createdAt','DESC']]
    });
    res.json(versions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.restoreVersion = async (req, res) => {
  try {
    const { id, versionId } = req.params;
    const { id:userId, username:userName } = req.user;
    
    const version = await PageVersion.findByPk(versionId);
    if (!version || version.pageId !== +id)
      return res.status(404).json({ message: "Version introuvable" });

    const page = await Page.findByPk(id);
    if (!page || page.isDeleted)
      return res.status(404).json({ message: "Page introuvable" });

    const oldContent = page.content;
    // snapshot courant
    await PageVersion.create({ pageId:id, content: oldContent });
    // restore
    await page.update({ content: version.content });
    // historique
    await Modification.create({
      operationType: "restauration-version",
      userId, userName,
      pageId: id, pageName: page.name,
      oldContent, newContent: version.content
    });
    res.json({ message: "Version restaurée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
