const { StaffConfidentialityContract, StaffDetails } = require('../models');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const { Sequelize, Op } = require('sequelize');
// const upload = require('../middlewares/multerConfig');

// Password generation function 
const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString('hex'); // Generates an 8-byte random password
};

// Set up Multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/uploads/staff'; // Directory where files will be saved
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const staffId = req.body.staff_id; // Get the staff_id from the request body
    const fileType = file.fieldname; // Get the type of file (e.g., confidentiality_contract_file)
    const timestamp = Date.now(); // Current timestamp for uniqueness
    const extension = path.extname(file.originalname); // Get the file extension (e.g., .jpg, .pdf)
    
    // Rename the file using staff_id, fileType, and timestamp
    const newFileName = `${staffId}_${fileType}_${timestamp}${extension}`;
    
    cb(null, newFileName); // Set the filename
  }
});

// Create multer instance for handling file uploads
const upload = multer({ storage: storage });

const getStaffList = async (searchTerm, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const whereCondition = searchTerm
    ? {
        staff_name: { [Op.iLike]: `%${searchTerm}%` }, // Search by staff name
      }
    : {};

  const { rows, count } = await StaffDetails.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
  });

  return { rows, totalCount: count };

};

// Get staff list with pagination and search
exports.staffList =  async (req, res) => {
  const searchTerm = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { rows, totalCount } = await getStaffList(searchTerm, page, limit);

  const totalPages = Math.ceil(totalCount / limit);

  res.render('staff/list', {
    staffList: rows,
    totalPages,
    currentPage: page,
    totalCount,
    searchTerm,
  });
};

exports.getStaffDetails =  async (req, res) => {
  const { staff_id } = req.body;

  try {
    // Fetch the staff details using Sequelize
    // const staff = await staffDetails.findOne({ where: { staff_id } });
    const staff = await StaffDetails.findOne({
      where: { staff_id },
      attributes: ['id', 'staff_name', 'ccdetails'],
    });

    if (!staff) {
      // If staff_id does not exist, return an error message
      return res.status(404).json({ error: 'Staff ID not found' });
    }

    // If staff is found, return the details
    return res.status(200).json({ staff });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while fetching staff details' });
  }
};
exports.renderConfidentialityForm = async (req, res) => {
  try {
    const staffList = await StaffDetails.findAll({ where: { is_deleted: false }}); // or any filtered query
    res.render('staff/confidentiality-contract', { staffList });
  } catch (err) {
    console.error(err);
    res.render('staff/confidentiality-contract', {
      staffList: [],
      errorMessage: 'Failed to load staff list',
    });
  }
};

exports.createContract = async (req, res) => {
  try {
    const contractData = req.body;

    const newContract = await StaffConfidentialityContract.create(contractData);

    req.flash('success', 'Contract created successfully');
    res.redirect('/contract/confidentiality-contract'); // ✅ Correct absolute path
  } catch (error) {
    console.error('Error creating contract:', error);
    req.flash('error', 'Error creating contract');
    res.redirect('/contract/confidentiality-contract'); // ✅ Correct absolute path
  }
};

exports.inductionProgramCreate = async (req, res) => {

  // console.log('req.body >>> ', JSON.stringify(req.body))

  // const { ...fieldsToAdd } = req.body;
console.log('Incoming form data:', req.body);

  try {
    const requestBody = {
      ...req.body
    };

    const dateFields = [
      'procd_norsafrl_date',
      'procd_aorharot_date',
      'procd_eisacaeiwh_date',
      'procd_hodcadh_date',
      'procd_rocp_date',
      'procd_ids_date',
      'procd_fc_date',
      'procd_keys_date',
      'procd_tr_date',
      'procd_soata_date',
      'procd_op_date',
      'procd_sal_date',
      'procd_gt_date',
      'procd_ul_date',
      'procd_cfoacacf_date',
      'procd_fafupfot_date',
      'procd_rchiael_date',
      'procd_fsprfsp_date',
      'procd_colcctlc_date',
      'procd_eosbchce_date'
    ];

    // Iterate over the date fields and remove the ones that are empty or invalid
    dateFields.forEach(field => {
      if (!req.body[field] || isNaN(Date.parse(req.body[field]))) {
        delete requestBody[field];  // Remove the field if it's empty or invalid
      }
    });

    // console.log('requestBody >> ', requestBody)

    const esResponse = await endService.create(requestBody);

    const esDetails = await getInductionProgramDetails(esResponse.id);

    req.flash('success', 'End Service added successfully....');
    res.redirect('hr/induction_program/create');
  } catch (error) {
    console.error('Error creating KPI:', error);
    req.flash('error', 'An error occurred while saving the End Service.');
    res.redirect('hr/induction_program/create');
  }


};


exports.logoutEmployee = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');  // Redirect to the login page after logout
  });
};

exports.health = async (req, res) => {
  res.status(200).send('Welcome to Health Page');
};



