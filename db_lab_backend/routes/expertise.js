const express = require('express');
const { create, update, deleter } = require('../controllers/expertise.js');
const { isExpert } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/create/:projectId', isExpert, create);
router.delete('/delete/:id', isExpert, deleter);
router.put('/update/:id', isExpert, update);

module.exports = router;