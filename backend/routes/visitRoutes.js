const express = require("express");
const router = express.Router();
const fileVisitController = require("../Controllers/fileVisitController");
const { verifyToken } = require("../middleware/authMiddleware"); 

// router.post("/track", verifyToken, visitController.trackVisit);
// router.get("/stats-by-file", verifyToken, visitController.getStatsByFile);
// router.get("/all-stats", verifyToken, visitController.getAllStats);
// router.get("/hourly-stats", verifyToken, visitController.getHourlyStatsByFile);

// Route pour enregistrer la visite
router.post('/trackVisit/:pageName',verifyToken,fileVisitController.trackVisit);
router.get('/hourlyStats/:pageName',verifyToken,fileVisitController.getHourlyStatsByPage);
//router.get('/:pageName', fileVisitController.getHourlyStatsByPage); 
// router.get('/hourly', fileVisitController.getHourlyStatsByPage);
// Route pour obtenir toutes les statistiques
router.get('/allStats', fileVisitController.getAllStats);



module.exports = router;
