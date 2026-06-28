const express = require('express');
const { create, getAll, deleter, update, getFromDb } = require('../controllers/skill.js');
const { isAdmin } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isAdmin, create);
router.get('/getAll', getAll);
router.delete('/delete/:skill_Id', isAdmin, deleter);
router.put('/:skill_Id', isAdmin, update);
router.get('/getFromDb', isAdmin, getFromDb);

module.exports = router;