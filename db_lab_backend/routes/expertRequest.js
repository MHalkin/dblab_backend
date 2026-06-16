const express = require('express');
const { create, update, deleter, getAll, getOwn } = require('../controllers/expertRequest.js');
const { isAdmin, isVerified, isStudent } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isStudent, isVerified, create);
router.delete('/delete/:id', isAdmin, deleter);
router.put('/update/:id', isAdmin, update);
router.get('/getAll', isAdmin, getAll);
router.get('/getOwn', isStudent, getOwn);

module.exports = router;