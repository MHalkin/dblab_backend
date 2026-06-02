const express = require('express');
const { archive, create, getAll, deleter, update, getById } = require('../controllers/project.js');
const { isStudent, isAdmin } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isStudent, create);
router.get('/getAll', getAll);
router.delete('/delete/:id', isStudent, deleter);
router.put('/:id', isStudent, update);
router.get('/:id', getById);
router.put('/archive/:id', isAdmin, archive);

module.exports = router;