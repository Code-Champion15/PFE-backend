const express = require("express");
const router = express.Router();
const { deployProject } = require("../Controllers/deployController");
const { verifyToken } = require ("../middleware/authMiddleware");

// Route pour lancer le build d'un projet
router.post("/",verifyToken, deployProject);

module.exports = router;
