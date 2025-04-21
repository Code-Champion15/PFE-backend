const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {sendVerificationEmail} = require ("../utils/email");

const JWT_SECRET = process.env.JWT_SECRET;
require("dotenv").config();

const loginAttempts = {}; 
const MAX_ATTEMPTS = 3; 
const LOCK_TIME = 5 * 60 * 1000; 

exports.register = async (req, res) => {
  try {
    const { username, email, password, role, superadminKey } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let isApproved = false;

    // if (role === "super-admin") {
    //   if (superadminKey !== process.env.SUPER_ADMIN_SECRET) {
    //     return res.status(403).json({ message: "Clé super-admin invalide" });
    //   }
    //   isApproved = true;
    // }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
      isApproved,
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    await sendVerificationEmail(user.email, token);

    res.status(201).json({
      message: "Utilisateur enregistré, veuillez vérifier votre email.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};


exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Cet email a déjà été vérifié" });
    }

    user.isVerified = true;

    //  if (user.role === 'super-admin') {
    //    user.isApproved = true;
    //  }
    await user.save();

    res.status(200).json({ message: "Email vérifié avec succès" });
  } catch (error) {
    res.status(400).json({ message: "Token invalide ou expiré", error: error.message });
  }
};

// Route de connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ message: "Identifiants invalides" });

    // Vérifier si le compte est bloqué
    if (user.failedAttempts >= 3) {
      return res.status(403).json({ message: "Compte bloqué après 3 échecs, réessayez plus tard" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      user.failedAttempts += 1;
      await user.save();
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Vérification de l'email
    if (!user.isVerified) {
      return res.status(403).json({ message: "Veuillez vérifier votre adresse email avant de vous connecter." });
    }

    // Vérification de l'approbation (sauf super-admin)
    if (user.role !== 'super-admin' && !user.isApproved) {
      return res.status(403).json({ message: "Votre compte est en attente de validation par un super-admin." });
    }

    // Réinitialisation des tentatives après succès
    user.failedAttempts = 0;
    await user.save();

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Connexion réussie", token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
};



const { sendResetPasswordEmail } = require("../utils/email");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Générer un token valable 15 minutes
    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });

    // Envoyer l'email avec le lien de réinitialisation
    await sendResetPasswordEmail(user.email, resetToken);

    res.json({ message: "Un email de réinitialisation a été envoyé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    res.status(400).json({ message: "Token invalide ou expiré", error: error.message });
  }
};







