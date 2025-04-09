const express = require("express");
const router = express.Router();
const statisticsController = require("../Controllers/statisticsController");

router.post("/track-visit", statisticsController.trackVisit);
router.get("/stats-by-page", statisticsController.getStatsByPage);
router.get("/stats-all",statisticsController.getAllStats);
router.get("/hourly", statisticsController.getHourlyStatsByPage);
module.exports = router;