const express = require('express');
const { create, getThread, deleter, update } = require('../controllers/projectComment.js');
const { isStudent, isVerified } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isStudent, isVerified, create);
router.get('/getThread/:id', getThread);
router.delete('/delete/:id', isStudent, isVerified, deleter);
router.put('/:id', isStudent, isVerified, update);

module.exports = router;