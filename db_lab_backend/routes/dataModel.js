const express = require('express');
const { create, servePhotoFile, deleter } = require('../controllers/dataModel.js');
const { isStudent, isVerified } = require('../middlewares/auth.js');
const router = express.Router();
const upload = require('../middlewares/multerData.js');

router.post('/create/:id', isStudent, isVerified, upload.single('file'), create);
router.delete('/delete/:id', isStudent, isVerified, deleter);

router.get('/photo/file/:filename', isStudent, servePhotoFile);

module.exports = router;