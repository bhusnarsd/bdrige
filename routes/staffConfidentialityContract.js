const express = require('express');
const router = express.Router();
const staffConfidentialityContractController = require('../controllers/staffConfidentialityContractController');

router.post('/confidentiality-contract',  staffConfidentialityContractController.createContract);
router.get('/confidentiality-contract', staffConfidentialityContractController.renderConfidentialityForm);
module.exports = router;
