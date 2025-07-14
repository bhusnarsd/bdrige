const express = require('express');
const router = express.Router();
const { registerStaff, staffList, editStaff, updateStaff, getStaffDetails, renderConfidentialityForm, createContract, renderSipCreatePage, staffConfContract, softDeleteStaff, exportExcel, getAllDepartments } = require('../controllers/staffController');
const { addStaffWarning, listStaffWarning, renderWarCreatePage, editWarningLetterForm, updateWarningLetter } = require('../controllers/StaffActivityController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, staffList);

// Routes for registration
router.get('/enrollment', (req, res) => {
  res.render('staff/enrollment');  // Render the register.ejs file
});


// router.get('/confidentiality-contract', (req, res) => {
//   res.render('staff/confidentiality-contract');  // Render the register.ejs file
// });
router.post('/enrollment', registerStaff);
router.get('/export/excel', exportExcel);
router.get('/edit/:id',  editStaff);
router.delete('/delete/:staff_id',  softDeleteStaff);
router.post('/edit/:id',  updateStaff);

router.post('/get-staff-details',  getStaffDetails);
router.get('/confidentiality-contract', authMiddleware, renderConfidentialityForm);
router.get('/confidentiality-contract/list', authMiddleware, staffConfContract);
// router.post('/confidentiality-contract', );
// router.get('/confidentiality-contract', authMiddleware, (req, res) => { res.render('staff/confidentiality-contract'); });
router.post('/confidentiality-contract',  createContract);

// router.get('/induction-program', authMiddleware, (req, res) => { res.render('staff/induction-program'); });
router.get('/hr/sip/create', renderSipCreatePage);
router.get('/warning-letter',  renderWarCreatePage  )// (req, res) => { res.render('staff/warning-letter'); });
router.get('/warning-letter/list', listStaffWarning);
router.post('/warning-letter', addStaffWarning);
router.get('/warning-letter/edit/:id', editWarningLetterForm);
router.post('/warning-letter/edit/:id',  updateWarningLetter);



router.get('/departments', getAllDepartments);
// router.get('/warning-letter', renderWarCreatePage);

// router.get('/end-service', authMiddleware, (req, res) => { res.render('staff/end-service'); });


module.exports = router;
