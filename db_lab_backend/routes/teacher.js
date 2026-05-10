const express = require('express');
const {
    create,
    getAll,
    deleter,
    update,
    getFromDb,
    uploadPhoto,
    servePhotoFile
} = require('../controllers/teacher.js');
const { isAdmin } = require('../middlewares/auth.js');
const upload = require('../middlewares/multerConfig.js');
const router = express.Router();

router.post('/create', isAdmin, create);
router.get('/getAll', getAll);
router.delete('/delete/:teacher_Id', isAdmin, deleter);
router.put('/:teacher_Id', isAdmin, update);
router.get('/getFromDb', getFromDb);

router.post('/:teacher_Id/upload-photo', isAdmin, upload.single('photo'), uploadPhoto);
router.get('/photo/file/:filename', servePhotoFile);

module.exports = router;