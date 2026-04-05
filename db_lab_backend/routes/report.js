const express = require('express');
const router = express.Router();
const { generatePlan, generateReport } = require('../controllers/report');
// middleware isAdmin, якщо звіти тільки для адміністраторів
// const { isAdmin } = require('../middlewares/auth'); 

router.get('/plan', generatePlan);
router.get('/year-report', generateReport);

module.exports = router;