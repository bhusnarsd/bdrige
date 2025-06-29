const express = require('express');
const router = express.Router();
const staffWarningController = require('../controllers/staffWarningController');

// Add staff warning
router.post('/add', staffWarningController.uploadFile, staffWarningController.addStaffWarning);

router.get('/es/create',    staffWarningController.renderEndCreatePage)
// Edit staff warning
router.post('/edit', staffWarningController.uploadFile, staffWarningController.editStaffWarning);

module.exports = router;
