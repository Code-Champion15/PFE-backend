const express = require('express');
const router = express.Router();
const operationController = require('../Controllers/operationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get("/", operationController.getAllOperations);
router.get("/myOperations", verifyToken, operationController.getMyOperations);

// router.get('/type/:type', operationController.getOperationsByType);

// router.get('/user/:username', operationController.getOperationsByUsername);

module.exports = router;
