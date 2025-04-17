const express = require('express');
const router = express.Router();
const aiController = require('../Controllers/aiController');
const { verifyToken } = require ("../middleware/authMiddleware");


router.post("/generate" ,verifyToken, aiController.generatePageFromPrompt);

module.exports = router;