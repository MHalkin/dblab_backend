const express = require('express');
const router = express.Router();
const { create, studentCreate, getMyResults, getAll, getFromDb, deleter, update, updateStatus } = require('../controllers/result');
const { isAdmin, isStudent } = require('../middlewares/auth');

router.post('/student/create', isStudent, studentCreate);
router.post('/create', isAdmin, create);
router.get('/work/:work_Id', isStudent, getMyResults);
router.get('/getFromDb', isAdmin, getFromDb);
router.put('/:result_Id', isAdmin, update);
router.put('/status/:result_Id', isAdmin, updateStatus);
router.delete('/delete/:result_Id', isAdmin, deleter);
router.get('/getall', getAll);

module.exports = router;