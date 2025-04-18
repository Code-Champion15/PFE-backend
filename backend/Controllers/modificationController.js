const Modification = require('../Models/modificationModel');
const Page = require('../Models/pageModel');
const User = require('../Models/userModel');



exports.getModificationHistory = async (req, res) => {
    try{
      const history = await Modification.findAll({
        order: [["createdAt", "DESC"]],
      });
      return res.json(history);
    } catch (error) {
      console.error("Backend : erreur lors de la recuperation de l historique", error);
      return res.status(500).json({ massage: "Erreur serveur", error: error.message});
    }
  };

  exports.getMyModificationHistory = async (req, res) => {
     try { 
        const userId = req.user.id;
        const modifications = await Modification.findAll({
            where: { userId },
            include: [
              {
                model: Page,
                attributes: ["id", "name", "route"]
              },
              {
                model: User,
                attributes: ["id", "username", "email"]
              }
            ],
            order: [["createdAt", "DESC"]]
          });
          console.log("Modifications récupérées :", modifications);
          
          res.status(200).json({
            success: true,
            data: modifications
          });
        } catch (error) { 
            console.error("Erreur lors de la récupération de l'historique :", error); 
            res.status(500).json({ success: false, message: "Erreur lors de la récupération de l'historique", error: error.message });
        } 
    };


