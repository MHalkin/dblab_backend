const express = require('express');
const { create, servePhotoFile, deleter } = require('../controllers/imbed.js');
const { isExpert, isStudent } = require('../middlewares/auth.js');
const router = express.Router();
const upload = require('../middlewares/multerData.js');

router.post('/create/:expertiseId', isExpert, upload.single('file'), create);
router.delete('/delete/:id', isExpert, deleter);

router.get('/photo/file/:filename', isStudent, servePhotoFile);

module.exports = router;