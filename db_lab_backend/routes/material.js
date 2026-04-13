const express = require('express');
const { create, getAll, deleter, update, getFromDb } = require('../controllers/material.js');
const { isAdmin } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isAdmin, create);
router.get('/getAll', getAll);
router.delete('/delete/:material_Id', isAdmin, deleter);
router.put('/:material_Id', isAdmin, update);
router.get('/getFromDb', isAdmin, getFromDb);

module.exports = router;