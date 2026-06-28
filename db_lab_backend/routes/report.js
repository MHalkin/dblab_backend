const express = require('express');
const router = express.Router();
const { generatePlan, generateReport } = require('../controllers/report');
const { isAdmin } = require('../middlewares/auth');

router.get('/plan', isAdmin, generatePlan);
router.get('/year-report', isAdmin, generateReport);

module.exports = router;