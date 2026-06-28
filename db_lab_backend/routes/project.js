const express = require('express');
const { updateProjectFull, archive, create, getAll, deleter, update, getById } = require('../controllers/project.js');
const { isStudent, isVerified, isAdmin } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isStudent, isVerified, create);
router.get('/getAll/expertise', (req, res) => getAll(req, res, 1));
router.get('/getAll/normalisation', (req, res) => getAll(req, res, 0));
router.get('/getAll', (req, res) => getAll(req, res, 3));
router.delete('/delete/:id', isStudent, isVerified, deleter);
router.put('/:id', isStudent, isVerified, update);
router.put('/updateProjectFull/:id', isStudent, isVerified, updateProjectFull);
router.get('/:id', getById);
router.put('/archive/:id', isAdmin, archive);

module.exports = router;