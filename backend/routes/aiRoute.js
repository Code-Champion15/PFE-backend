const express = require('express');
const router = express.Router();
const aiController = require('../Controllers/aiController');
const { verifyToken } = require ("../middleware/authMiddleware");


router.post("/generate" ,verifyToken, aiController.generatePageFromPrompt); //modif
router.post("/generateCode",verifyToken,aiController.generateCode); //creation

module.exports = router;