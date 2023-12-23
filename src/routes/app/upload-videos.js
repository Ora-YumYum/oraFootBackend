const express = require('express');
const router = express.Router();
const videoUploadController = require('../../controllers/video_upload');


router.post('/', videoUploadController.uploadFile);
module.exports = router;
