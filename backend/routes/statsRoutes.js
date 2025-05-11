const express = require('express');
const router = express.Router();
const statsController = require('../Controllers/statsController');
const { verifyToken } = require ("../middleware/authMiddleware");

router.get('/admin/tableau',verifyToken, statsController.getDashboardStats);

module.exports = router;