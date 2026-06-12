const express = require('express');
const { updateProjectFull, archive, create, getAll, deleter, update, getById } = require('../controllers/project.js');
const { isStudent, isAdmin } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isStudent, create);
router.get('/getAll/expertise', (req, res) => getAll(req, res, 1));
router.get('/getAll/normalisation', (req, res) => getAll(req, res, 0));
router.get('/getAll', (req, res) => getAll(req, res, 3));
router.delete('/delete/:id', isStudent, deleter);
router.put('/:id', isStudent, update);
router.put('/updateProjectFull/:id', isStudent, updateProjectFull);
router.get('/:id', getById);
router.put('/archive/:id', isAdmin, archive);

module.exports = router;