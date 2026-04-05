const express = require('express');
const { getMagazineStatistics, getPeriodStatistics } = require('../controllers/statistics.js');
const { isAdmin } = require('../middlewares/auth.js');
const router = express.Router();

router.get('/magazines', isAdmin, getMagazineStatistics);
router.post('/period', isAdmin, getPeriodStatistics);

module.exports = router;