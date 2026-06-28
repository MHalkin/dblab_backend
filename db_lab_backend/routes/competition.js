const express = require('express');
const { create, getAll, deleter, update, getFromDb } = require('../controllers/competition.js');
const { isAdmin } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isAdmin, create);
router.get('/getAll', getAll);
router.delete('/delete/:competition_Id', isAdmin, deleter);
router.put('/:competition_Id', isAdmin, update);
router.get('/getFromDb', isAdmin, getFromDb);

module.exports = router;

