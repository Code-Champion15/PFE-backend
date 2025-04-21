const router = require("express").Router();
const adminController     = require("../Controllers/adminController");
const authorize = require("../middleware/authorize");
const { verifyToken } = require("../middleware/authMiddleware"); 
// Toutes les routes protégées pour super-admin

router.use(verifyToken);
router.use(authorize("super-admin"));

// Gestion des admins
router.get("/admins",verifyToken,adminController.getAdmins);
router.get("/admins/pending",verifyToken,adminController.getPendingAdmins);
router.post("/admins",verifyToken,adminController.createAdmin);
router.put("/admins/:id",verifyToken,adminController.updateAdmin);
router.delete("/admins/:id",verifyToken,adminController.deleteAdmin);

router.put("/admins/approve/:Id",verifyToken,adminController.approveAdmin);


module.exports = router;
