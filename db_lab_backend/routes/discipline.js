const express = require('express');
const { create, getAll, deleter, getFull, update, getFullId, getFromDb } = require('../controllers/discipline.js');
const { isAdmin } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isAdmin, create);
router.get('/getAll', getAll);
router.delete('/delete/:discipline_Id', isAdmin, deleter);
router.get('/getFull', getFull);
router.put('/:discipline_Id', isAdmin, update);
router.get('/getFull/:discipline_Id', getFullId);
router.get('/getFromDb', isAdmin, getFromDb);

module.exports = router;