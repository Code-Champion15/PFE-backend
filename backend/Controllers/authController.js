const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {sendVerificationEmail} = require ("../utils/email");

const JWT_SECRET = process.env.JWT_SECRET;
require("dotenv").config();

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

    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Veuillez vérifier votre email" });
    }

    // Création du token JWT pour l'utilisateur connecté
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role },JWT_SECRET,{ expiresIn: "1h" });

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
};