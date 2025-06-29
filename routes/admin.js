const express = require('express');
const router = express.Router();
const { enquiryCreate } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// router.get('/', authMiddleware, staffList);

// Routes for registration
router.get('/enquiry', authMiddleware, (req, res) => { res.render('admin/enquiry'); });
router.get('/kpi', authMiddleware, (req, res) => { res.render('admin/kpi'); });

router.post('/enquiry', authMiddleware, enquiryCreate);


// router.get('/edit/:id',  editStaff);
// router.post('/edit/:id',  updateStaff);

module.exports = router;
