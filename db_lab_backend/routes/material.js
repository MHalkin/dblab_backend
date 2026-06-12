const express = require('express');
const {
    create,
    getAll,
    deleter,
    update,
    getFromDb,
    uploadFile,
    serveMaterialFile
} = require('../controllers/material.js');
const { isAdmin, isStudent } = require('../middlewares/auth.js');
const upload = require('../middlewares/multerMaterial.js');
const router = express.Router();

router.post('/create', isAdmin, create);
router.get('/getAll', getAll);
router.delete('/delete/:material_Id', isAdmin, deleter);
router.put('/:material_Id', isAdmin, update);
router.get('/getFromDb', getFromDb);

router.post('/:material_Id/upload-file', isAdmin, upload.single('file'), uploadFile);
router.get('/file/:filename', serveMaterialFile);

module.exports = router;