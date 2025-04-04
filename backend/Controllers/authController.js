const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {sendVerificationEmail} = require ("../utils/email");

const JWT_SECRET = process.env.JWT_SECRET;
require("dotenv").config();

const loginAttempts = {}; // Stocke les tentatives par email
const MAX_ATTEMPTS = 3; // Nombre max de tentatives
const LOCK_TIME = 5 * 60 * 1000; // 5 minutes de blocage

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Vérification si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      isVerified: false, 
    });

    // Création d'un token JWT pour la vérification de l'email
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {expiresIn: "1h",});

    // Envoi de l'email de vérification
    await sendVerificationEmail(user.email, token);

    res.status(201).json({
      message: "Utilisateur enregistré, veuillez vérifier votre email.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
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

    // Réinitialiser les tentatives après une connexion réussie
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

