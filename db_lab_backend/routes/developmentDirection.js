const express = require('express');
const { create, getAll, deleter, update, getRoad, getFromDb } = require('../controllers/developmentDirection.js');
const { isAdmin } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isAdmin, create);
router.get('/getAll', getAll);
router.delete('/delete/:development_direction_Id', isAdmin, deleter);
router.put('/:development_direction_Id', isAdmin, update);
router.get('/getRoad/:development_direction_Id', getRoad);
router.get('/getFromDb', isAdmin, getFromDb);

module.exports = router;