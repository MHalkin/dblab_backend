const express = require('express');
const { create, servePhotoFile, deleter } = require('../controllers/imbed.js');
const { isExpert } = require('../middlewares/auth.js');
const router = express.Router();
const upload = require('../middlewares/multerConfig.js');

router.post('/create/:expertiseId', isExpert, upload.single('photo'), create);
router.delete('/delete/:id', isExpert, deleter);

router.get('/photo/file/:filename', servePhotoFile);

module.exports = router;