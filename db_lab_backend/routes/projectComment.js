const express = require('express');
const { create, getThread, deleter, update } = require('../controllers/projectComment.js');
const { isStudent } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isStudent, create);
router.get('/getThread/:id', getThread);
router.delete('/delete/:id', isStudent, deleter);
router.put('/:id', isStudent, update);

module.exports = router;