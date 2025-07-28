const express = require('express');
const router = express.Router();
const multer = require('multer');
const { kpiList, kpiCreate, editKpi, kpiUpdate, renderKPICreatePage } = require('../controllers/kpiController');
const { disputeList, disputeCreate, disputeEdit, disputeUpdate, renderDisputeCreatePage } = require('../controllers/disputeController');
const { endServiceList, endServiceCreate, endServiceEdit, endServiceUpdate, renderEndCreatePage } = require('../controllers/endServiceController');
const { inductionProgramList, inductionProgramCreate, inductionProgramEdit, inductionProgramUpdate, renderSipCreatePage } = require('../controllers/inductionProgramController');
const { handBookList, handBookCreate, handBookEdit, handBookUpdate, renderHandCreatePage } = require('../controllers/handBookController');
const authMiddleware = require('../middlewares/authMiddleware');

const upload = multer();

// Routes for template
// router.get('/kpi', (req, res) => { res.render('hr/kpi', { success: req.query.success }); });
router.get('/kpi', kpiList);
router.get('/kpi/create',  renderKPICreatePage);//(req, res) => { res.render('hr/kpi/kpi', { messages: req.flash() }); });
router.post('/kpi/create', upload.none(), kpiCreate);
router.get('/kpi/edit/:id', editKpi);
router.post('/kpi/edit/:id', upload.none(), kpiUpdate);

router.get('/dispute', disputeList);
router.get('/dispute/create',  renderDisputeCreatePage)//(req, res) => { res.render('hr/dispute/create', { messages: req.flash() }); });
router.post('/dispute/create', upload.none(), disputeCreate);
router.get('/dispute/edit/:id', disputeEdit);
router.post('/dispute/edit/:id', upload.none(), disputeUpdate);

router.get('/es', endServiceList);
router.get('/es/create',    renderEndCreatePage) //(req, res) => { res.render('hr/end_service/create', { messages: req.flash() }); });
router.post('/es/create', upload.none(), endServiceCreate);
router.get('/es/edit/:id', endServiceEdit);
router.post('/es/edit/:id', upload.none(), endServiceUpdate);

router.get('/sip', inductionProgramList);
router.get('/sip/create',  renderSipCreatePage)
router.post('/sip/create', upload.none(), inductionProgramCreate);
router.get('/sip/edit/:id', inductionProgramEdit);
router.post('/sip/edit/:id', upload.none(), inductionProgramUpdate);

router.get('/hb', handBookList);
router.get('/hb/create',   renderHandCreatePage) //(req, res) => { res.render('hr/handbook/create', { messages: req.flash() }); });
router.post('/hb/create', upload.none(), handBookCreate);
router.get('/handbook/edit/:id', handBookEdit);
router.post('/handbook/edit/:id', upload.none(), handBookUpdate);

// router.get('/edit/:id',  editStaff);
// router.post('/edit/:id',  updateStaff);

module.exports = router;
