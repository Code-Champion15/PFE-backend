const express = require('express');
const router = express.Router();
const pageController = require('../Controllers/pageController');

router.post('/', pageController.createPage);
router.get('/', pageController.getPages);
router.get('/withchildren', pageController.getAllPagesWithChildren);
router.get('/:id', pageController.getPageById);
router.get('/byroute/:route', pageController.getPageByRoute);
router.get('/content/:id', pageController.getContentById);
router.get('/contentbyroute/:route',pageController.getContentByRoute);
router.put('/:id', pageController.updatePage);
router.put('/update/:id', pageController.updatePageContent);
router.delete('/:id', pageController.deletePage);
module.exports = router;