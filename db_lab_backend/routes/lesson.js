const express = require('express');
const { create, getAll, deleter, update, getFromDb, getLessonsBetweenDates } = require('../controllers/lesson.js');
const { isAdmin } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create', isAdmin, create);
router.get('/getAll', getAll);
router.delete('/delete/:lesson_Id', isAdmin, deleter);
router.put('/:lesson_Id', isAdmin, update);
router.get('/getFromDb', isAdmin, getFromDb);
router.get('/getLessonsBetweenDates', getLessonsBetweenDates);

module.exports = router;