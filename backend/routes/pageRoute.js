const express = require('express');
const router = express.Router();
const pageController = require('../Controllers/pageController');
const { verifyToken } = require ("../middleware/authMiddleware");
const pageVersionController = require('../Controllers/pageVersionController');
router.post('/create',verifyToken, pageController.createPage);
//router.post("/generate" ,verifyToken, pageController.generatePageFromPrompt);

router.get('/', pageController.getPages);


router.get('/list', pageController.getPageList); 
router.get('/withchildren', pageController.getAllPagesWithChildren);
//router.get("/history", verifyToken, pageController.getModificationHistory);
router.get('/:id', pageController.getPageById);
router.get('/byroute/:route', pageController.getPageByRoute);
router.get('/content/:id', pageController.getContentById);
router.get('/contentbyroute/:route',pageController.getContentByRoute);
//versionning
router.get('/:id/restore',verifyToken, pageVersionController.getVersions);


router.put('/:id', pageController.updatePage);

router.put('/update/:id',verifyToken, pageController.updatePageContent);

router.put('/restore/:id',verifyToken, pageController.restorePage);
//version
router.put('/:id/versions/:versionId/restore', verifyToken, pageVersionController.restoreVersion);
router.delete('/delete/:id',verifyToken, pageController.deletePage);
module.exports = router;