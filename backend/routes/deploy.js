const express = require("express");
const router = express.Router();
const deployController = require("../Controllers/deployController");
const { verifyToken } = require ("../middleware/authMiddleware");

// Route pour lancer le build d'un projet
router.post("/",verifyToken, deployController.deployProject);

module.exports = router;
