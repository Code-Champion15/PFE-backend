const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    try{
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({username, email, password: hashedPassword, role });
        res.status(201).json({ message: "user enregistré", user: {id: user.id, username: user.username, email: user.email, role: user.role}});
    } catch (error) {

        res.status(500).json({ message: "erreur lors de l'inscription", error: error.message});
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password } = req.body;
        const user = await User.findOne ({ where: {email}});

        if (!user) return res.status(401).json({ message: "identifiants invalides"});
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) return res.status(401).json({message: "Identifiant invalides"});
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role}, JWT_SECRET, { expiresIn: "1h"});
        res.json({ message: "Connexion reussie", token});

    } catch (error) {
        res.status(500).json({ message: "erreur lors de la cnx", error: error.message});
    }
};