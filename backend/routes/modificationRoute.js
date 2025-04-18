const express = require('express');
const router = express.Router();
const modificationController = require('../Controllers/modificationController');
const { verifyToken } = require ("../middleware/authMiddleware");

router.get("/history", verifyToken, modificationController.getModificationHistory);

router.get("/my-history", verifyToken, modificationController.getMyModificationHistory);

module.exports = router;