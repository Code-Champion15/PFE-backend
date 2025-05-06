const express = require('express');
const router = express.Router();

const { verifyToken } = require ("../middleware/authMiddleware");
const projetController = require('../Controllers/projetController');
// routes/projectRoutes.js
router.get('/my-projects',verifyToken, projetController.getUserProjects);
router.get('/active',verifyToken, projetController.getActiveProject);
router.get('/:projectId/download',verifyToken, projetController.downloadProject);
router.post('/set-active',verifyToken, projetController.setActiveProject);

module.exports = router;