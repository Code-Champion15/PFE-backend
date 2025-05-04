const express = require('express');
const router = express.Router();
const uploadController = require('../Controllers/uploadController');
const { verifyToken } = require ("../middleware/authMiddleware");


// Route POST pour uploader un fichier ZIP
router.post(
    '/upload',verifyToken,
    uploadController.uploadMiddleware, // middleware multer
    uploadController.handleUpload      // logique de traitement
  );
  
  module.exports = router;