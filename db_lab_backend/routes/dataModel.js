const express = require('express');
const { create, servePhotoFile, deleter } = require('../controllers/dataModel.js');
const { isStudent } = require('../middlewares/auth.js');
const router = express.Router();
const upload = require('../middlewares/multerConfig.js');

router.post('/create/:id', isStudent, upload.single('photo'), create);
router.delete('/delete/:id', isStudent, deleter);

router.get('/photo/file/:filename', servePhotoFile);

module.exports = router;