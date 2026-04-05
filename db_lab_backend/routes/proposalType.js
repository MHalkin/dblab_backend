const express = require('express');
const {create, getAll, deleter, update, getFromDb} = require('../controllers/proposalType.js');
const {isAdmin} = require('../middlewares/auth.js');
const {notUpToDate} = require('../middlewares/cache.js');
const router = express.Router();

router.post('/create', isAdmin, notUpToDate, create);
router.get('/getAll', getAll);
router.delete('/delete/:proposal_type_Id', isAdmin, notUpToDate, deleter);
router.put('/:proposal_type_Id', isAdmin, notUpToDate, update);
router.get('/getFromDb', isAdmin, getFromDb);

module.exports = router;

