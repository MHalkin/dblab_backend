const express = require('express');
const { create, getAll, deleter, update, getFromDb } = require('../controllers/proposal.js');
const { isAdmin } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isAdmin, create);
router.get('/getAll', getAll);
router.delete('/delete/:proposal_Id', isAdmin, deleter);
router.put('/:proposal_Id', isAdmin, update);
router.get('/getFromDb', isAdmin, getFromDb);

module.exports = router;

