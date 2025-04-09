const express = require('express');
const router = express.Router();
const pageController = require('../Controllers/pageController');
const { verifyToken } = require ("../middleware/authMiddleware");

router.post('/create',verifyToken, pageController.createPage);

router.get('/', pageController.getPages);
router.get('/list', pageController.getPageList); 
router.get('/withchildren', pageController.getAllPagesWithChildren);
router.get("/history", verifyToken, pageController.getModificationHistory);

router.get('/:id', pageController.getPageById);
router.get('/byroute/:route', pageController.getPageByRoute);
router.get('/content/:id', pageController.getContentById);
router.get('/contentbyroute/:route',pageController.getContentByRoute);


router.put('/:id', pageController.updatePage);

router.put('/update/:id',verifyToken, pageController.updatePageContent);

router.delete('/:id', pageController.deletePage);
module.exports = router;