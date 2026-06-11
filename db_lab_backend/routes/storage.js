const express = require('express');
const { getDbStorage, getUploadsStorage, getDiskStorage } = require('../controllers/storage.js');
const { isAdmin } = require('../middlewares/auth.js');
const router = express.Router();

router.get('/getDb', isAdmin, getDbStorage);
router.get('/getFiles', isAdmin, getUploadsStorage);
router.get('/getAll', isAdmin, getDiskStorage);

module.exports = router;