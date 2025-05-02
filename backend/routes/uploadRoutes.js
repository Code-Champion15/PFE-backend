const express = require('express');
const router = express.Router();
const uploadController = require('../Controllers/uploadController');

// Route POST pour uploader un fichier ZIP
router.post(
    '/upload',
    uploadController.uploadMiddleware, // middleware multer
    uploadController.handleUpload      // logique de traitement
  );
  
  module.exports = router;