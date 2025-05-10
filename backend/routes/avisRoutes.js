const express = require("express");
const router = express.Router();
const avisController = require("../Controllers/avisController");
const { verifyToken } = require ("../middleware/authMiddleware");

router.post("/create", verifyToken, avisController.createAvis);
router.get("/", avisController.getAllAvis);

module.exports = router;
