const { User } = require("../Models");

exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({
      where: { role: "admin", isApproved: true }
    });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /admins/pending         → liste des admins en attente
// exports.getPendingAdmins = async (req, res) => {
//   try {
//     const pendings = await User.findAll({
//       where: { role: "admin", isApproved: false }
//     });
//     res.json(pendings);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


exports.getPendingAdmins = async (req, res) => {
    try {
      const pendingUsers = await User.findAll({
        where: {
          isApproved: false,
          isVerified: true, 
          role:"admin",
        },
        attributes: ['id', 'username', 'email', 'createdAt'],
      });
  
      res.status(200).json(pendingUsers);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  
  exports.createAdmin = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // 🔍 Vérification si l'email existe déjà
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
      }
  
      const newAdmin = await User.create({
        username,
        email,
        password,
        role: "admin",
        isApproved: true,
        isVerified: true,
      });
  
      res.status(201).json(newAdmin);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur lors de la création" });
    }
  };
  

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = (({ username, email, isApproved }) => ({ username, email, isApproved }))(req.body);
    const admin = await User.findByPk(id);
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin introuvable" });
    }
    await admin.update(updates);
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findByPk(id);
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin introuvable" });
    }
    await admin.destroy();
    res.json({ message: "Admin supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveAdmin = async (req, res) => {
  try {
    const userId = req.params.Id;
    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.isApproved = true;
    await user.save();

    res.status(200).json({ message: "Compte approuvé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};


