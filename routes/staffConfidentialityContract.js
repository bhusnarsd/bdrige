const express = require('express');
const router = express.Router();
const staffConfidentialityContractController = require('../controllers/staffConfidentialityContractController');

router.post('/confidentiality-contract',  staffConfidentialityContractController.createContract);
router.get('/confidentiality-contract', staffConfidentialityContractController.renderConfidentialityForm);

router.get('/confidentiality-contract/edit/:id', staffConfidentialityContractController.editContract);
router.post('/confidentiality-contract/edit/:id', staffConfidentialityContractController.updateContract);

module.exports = router;
