const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

router.get('/verify/:token', authController.verifyEmail); 

router.get('/pending-requests', authController.getPendingAdmins);

router.put('/approve/:Id', authController.approveAdmin);
module.exports = router;