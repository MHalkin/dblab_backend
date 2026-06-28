const express = require('express');
const { create, getAll, deleter, update, getFromDb } = require('../controllers/magazine.js');
const { isAdmin } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isAdmin, create);
router.get('/getAll', getAll);
router.delete('/delete/:magazine_Id', isAdmin, deleter);
router.put('/:magazine_Id', isAdmin, update);
router.get('/getFromDb', isAdmin, getFromDb);

module.exports = router;

