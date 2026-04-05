const express = require('express');
const router = express.Router();
const { create, studentCreate, getAll, deleter, studentDelete, update, getFromDb, getMyWorks, updateStatus } = require('../controllers/work');
const { isAdmin, isStudent } = require('../middlewares/auth');

router.post('/student/create', isStudent, studentCreate); 
router.post('/create', isAdmin, create);
router.get('/user/:user_Id', isStudent, getMyWorks);
router.get('/getFromDb', isAdmin, getFromDb);
router.put('/:work_Id', isAdmin, update);
router.put('/status/:work_Id', isAdmin, updateStatus);
router.delete('/delete/:work_Id', isAdmin, deleter);
router.delete('/student/delete/:work_Id', isStudent, studentDelete);
router.get('/getall', getAll);

module.exports = router;