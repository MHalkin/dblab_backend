const express = require('express');
const { create, update, deleter, getAll } = require('../controllers/expertRequest.js');
const { isAdmin, isStudent } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isStudent, create);
router.delete('/delete/:id', isAdmin, deleter);
router.put('/update/:id', isAdmin, update);
router.get('/getAll', isAdmin, getAll);

module.exports = router;