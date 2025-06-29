const { staffLoginDetails, StaffDetails, StaffConfidentialityContract } = require('../models');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const { Sequelize, Op } = require('sequelize');
const { getStaffConfidentialityContractList } = require('../utils/staffUtils')
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

// Get staff list with pagination and search
exports.staffConfContract =  async (req, res) => {
  const searchTerm = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { rows, totalCount } = await getStaffConfidentialityContractList(searchTerm, page, limit);

  const totalPages = Math.ceil(totalCount / limit);

  res.render('staff/confidentiality-contract-list', {
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
    // const staff = await StaffDetails.findOne({ where: { staff_id } });
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
    const staffList = await StaffDetails.findAll(); // or any filtered query
    res.render('staff/confidentiality-contract', { staffList });
  } catch (err) {
    console.error(err);
    res.render('staff/confidentiality-contract', {
      staffList: [],
      errorMessage: 'Failed to load staff list',
    });
  }
};

exports.renderSipCreatePage = async (req, res) => {
  try {
    const staffList = await StaffDetails.findAll(); // fetch staff list
    // console.log("staffList",staffList)
    res.render('hr/sip/create', { staffList });
  } catch (err) {
    console.error(err);
    res.render('hr/sip/create', {
      staffList: [],
      errorMessage: 'Failed to load staff list',
    });
  }
};




// Export staff list to Excel
exports.exportExcel =  async (req, res) => {
  const searchTerm = req.query.search || '';
  const { rows } = await getStaffList(searchTerm, 1, 1000); // Get all staff data for export

  // Convert the staff rows into a format suitable for xlsx
  const staffData = rows.map(staff => ({
    'Staff ID': staff.staff_id,
    'Staff Name': staff.staff_name,
    'Email': staff.staff_email,
    'Phone': staff.staff_phone,
    'Confidentiality Contract': staff.confidentiality_contract_file,
    'Employee Handbook': staff.employee_handbook_file,
    // Add other fields as needed
  }));

  // Create a new workbook and add data
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(staffData);
  XLSX.utils.book_append_sheet(wb, ws, 'Staff List');

  // Set the response headers for Excel file download
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=staff_list.xlsx');

  // Write the Excel file to the response
  XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
  res.end();
};

// Export staff list to PDF
exports.exportPdf =  async (req, res) => {
  const searchTerm = req.query.search || '';
  const { rows } = await getStaffList(searchTerm, 1, 1000); // Get all staff data for export

  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=staff_list.pdf');

  doc.pipe(res);

  doc.fontSize(16).text('Staff List', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12);
  rows.forEach(staff => {
    doc.text(`${staff.staff_id} - ${staff.staff_name} - ${staff.staff_email}`);
  });

  doc.end();
};

exports.registerStaff = async (req, res) => {
  // Use multer middleware to handle the file uploads
  upload.fields([    
    { name: 'passport_file', maxCount: 1 },
    { name: 'visa_file', maxCount: 1 },
    { name: 'exp_letter_file', maxCount: 1 },
    { name: 'license_file', maxCount: 1 },
    { name: 'emirates_id_file', maxCount: 1 },
    { name: 'hepatitis_b_file', maxCount: 1 },
    { name: 'bls_file', maxCount: 1 },
    { name: 'hdc_file', maxCount: 1 },
    { name: 'dhacda_license_file', maxCount: 1 },
    { name: 'employment_contract_file', maxCount: 1 },
    { name: 'confidentiality_contract_file', maxCount: 1 },
    { name: 'employee_handbook_file', maxCount: 1 },
    { name: 'dhacda_policies_file', maxCount: 1 }
  ])(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.render('staff/enrollment', { errorMessage: 'Error uploading files' });
    }

    const {
      staff_name,
      staff_id,
      staff_email,
      staff_phone,
      dob,
      econtact,
      bank_acc,
      permanent_address,
      temporary_address,
      ccdetails,
      references,
      twrips_date,
      twrips,
      itcpd,
      itcpd_status,
      passport_file,
      passport_expiry,
      passport,
      visa_file,
      visa_expiry,
      visa,
      exp_letter_file,
      exp_letter_date,
      experience,
      license_file,
      license_expiry,
      license,
      emirates_id_file,
      emirates_id_expiry,
      emirates_id,
      hepatitis_b_file,
      hepatitis_b_expiry,
      hepatitis_b,
      bls_file,
      bls_file_date,
      bls,
      hdc_file,
      hdc_file_date,
      hdc,
      dhacda_license_file,
      dhacda_license_expiry,
      dhacda_license,
      employment_contract_file,
      employment_contract_expiry,
      employment_contract,
      confidentiality_contract_file,
      confidentiality_contract_expiry,
      confidentiality_contract,
      employee_handbook_file,
      employee_handbook_expiry,
      employee_handbook,
      dhacda_policies_file,
      dhacda_policies_expiry,
      dhacda_policies } = req.body;

    // Extract the file paths
    const passportfile = req.files['passport_file'] ? req.files['passport_file'][0].filename : null;
    const visafile = req.files['visa_file'] ? req.files['visa_file'][0].filename : null;
    const exp_letterfile = req.files['exp_letter_file'] ? req.files['exp_letter_file'][0].filename : null;
    const licensefile = req.files['license_file'] ? req.files['license_file'][0].filename : null;
    const emirates_idfile = req.files['emirates_id_file'] ? req.files['emirates_id_file'][0].filename : null;
    const hepatitis_bfile = req.files['hepatitis_b_file'] ? req.files['hepatitis_b_file'][0].filename : null;
    const blsfile = req.files['bls_file'] ? req.files['bls_file'][0].filename : null;
    const hdcfile = req.files['hdc_file'] ? req.files['hdc_file'][0].filename : null;
    const dhacda_licensefile = req.files['dhacda_license_file'] ? req.files['dhacda_license_file'][0].filename : null;
    const employment_contractfile = req.files['employment_contract_file'] ? req.files['employment_contract_file'][0].filename : null;
    const confidentiality_contractfile = req.files['confidentiality_contract_file'] ? req.files['confidentiality_contract_file'][0].filename : null;
    const employee_handbookfile = req.files['employee_handbook_file'] ? req.files['employee_handbook_file'][0].filename : null;
    const dhacda_policiesfile = req.files['dhacda_policies_file'] ? req.files['dhacda_policies_file'][0].filename : null;


    const itcpdString = Array.isArray(itcpd) ? itcpd.join(', ') : itcpd;
    const visa_expiry_date = (visa_expiry && visa_expiry !== 'Invalid date') ? visa_expiry : null;
    const passport_expiry_date = (passport_expiry && passport_expiry !== 'Invalid date') ? passport_expiry : null;
    const exp_letter_date_date = (exp_letter_date && exp_letter_date !== 'Invalid date') ? exp_letter_date : null;
    const license_expiry_date = (license_expiry && license_expiry !== 'Invalid date') ? license_expiry : null;
    const emirates_id_date = (emirates_id_expiry && emirates_id_expiry !== 'Invalid date') ? emirates_id_expiry : null;
    const hepatitis_b_date = (hepatitis_b_expiry && hepatitis_b_expiry !== 'Invalid date') ? hepatitis_b_expiry : null;
    const bls_file_date_date = (bls_file_date && bls_file_date !== 'Invalid date') ? bls_file_date : null;
    const hdc_file_date_date = (hdc_file_date && hdc_file_date !== 'Invalid date') ? hdc_file_date : null;
    const dhacda_license_date = (dhacda_license_expiry && dhacda_license_expiry !== 'Invalid date') ? dhacda_license_expiry : null;
    const employment_contract_date = (employment_contract_expiry && employment_contract_expiry !== 'Invalid date') ? employment_contract_expiry : null;
    const confidentiality_contract_date = (confidentiality_contract_expiry && confidentiality_contract_expiry !== 'Invalid date') ? confidentiality_contract_expiry : null;
    const employee_handbook_date = (employee_handbook_expiry && employee_handbook_expiry !== 'Invalid date') ? employee_handbook_expiry : null;
    const dhacda_policies_date = (dhacda_policies_expiry && dhacda_policies_expiry !== 'Invalid date') ? dhacda_policies_expiry : null;

    console.log('req.body ', JSON.stringify(req.body))

    if (!staff_id || !staff_email) {
      // return res.status(400).send('Name and email are required');
      return res.render('staff/enrollment', { errorMessage: 'Name and email are required' });
    }

    try {
      // Create the staff details in the staff_details table
      const staff = await StaffDetails.create({
        staff_name,
        staff_id,
        staff_email,
        staff_phone,
        dob,
        econtact,
        bank_acc,
        permanent_address,
        temporary_address,
        ccdetails,
        references,
        twrips_date,
        twrips,
        itcpd: itcpdString,
        itcpd_status,
        passport_file: passportfile,
        passport_expiry: passport_expiry_date,
        passport,
        visa_file: visafile,
        visa_expiry: visa_expiry_date,
        visa,
        exp_letter_file: exp_letterfile,
        exp_letter_date: exp_letter_date_date,
        experience,
        license_file: licensefile,
        license_expiry: license_expiry_date,
        license,
        emirates_id_file: emirates_idfile,
        emirates_id_expiry: emirates_id_date,
        emirates_id,
        hepatitis_b_file: hepatitis_bfile,
        hepatitis_b_expiry: hepatitis_b_date,
        hepatitis_b,
        bls_file: blsfile,
        bls_file_date: bls_file_date_date,
        bls,
        hdc_file: hdcfile,
        hdc_file_date: hdc_file_date_date,
        hdc,
        dhacda_license_file: dhacda_licensefile,
        dhacda_license_expiry: dhacda_license_date,
        dhacda_license,
        employment_contract_file: employment_contractfile,
        employment_contract_expiry: employment_contract_date,
        employment_contract,
        confidentiality_contract_file: confidentiality_contractfile,
        confidentiality_contract_expiry: confidentiality_contract_date,
        confidentiality_contract,
        employee_handbook_file: employee_handbookfile,
        employee_handbook_expiry: employee_handbook_date,
        employee_handbook,
        dhacda_policies_file: dhacda_policiesfile,
        dhacda_policies_expiry: dhacda_policies_date,
        dhacda_policies
      });
      console.log('Staff created:', staff);
      // Access the `id` of the newly created record
      const newStaffId = staff.id;
      console.log('newStaffId >> ', newStaffId)

      try {
        // Generate random password and hash it
        // const password = generateRandomPassword();
        const password = '123456';
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt rounds of 10

        // Create user with hashed password
        const staffLoginRes = await staffLoginDetails.create({
          staff_id: newStaffId,
          name: staff_name,
          email: staff_email,
          profileImage: null,
          signatureImage: null,
          password: hashedPassword,  // Save the hashed password
        });
      } catch (err) {
        console.error('Error saving user data:', err);
      }

      // Send email with the generated password
      // await sendWelcomeEmail(email, password);

      // Respond with the user data (excluding sensitive information like password)
      // res.status(201).json({ user });
      return res.render('staff/enrollment', { successMessage: 'Staff Enrollment done successfully!' });

    } catch (err) {
      console.error('Error during staff creation:', err);
      // res.status(500).send('Error saving user data');
      return res.render('staff/enrollment', { errorMessage: 'Error saving Staff Enrollment data' });
    }
  });
};

const getStaffDetails = async (staffId) => {
  const staff = await StaffDetails.findOne({ where: { id: staffId } });
  if (staff) {
    return staff.get();  // This converts the Sequelize instance to a plain object
  }
  return null;
};

exports.editStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await getStaffDetails(id);
    console.log('staff >> ', staff)
    if (!staff) {
      return res.status(404).render('error', { message: 'Staff not found' });
    }
    // res.render('staff/editStaff', { staff: staff.dataValues });
    res.render('staff/editStaff', { staff });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
};

// exports.updateStaff = async (req, res) => {
//   upload.fields([
//     { name: 'passport_file', maxCount: 1 },
//     { name: 'visa_file', maxCount: 1 },
//     { name: 'exp_letter_file', maxCount: 1 },
//     { name: 'license_file', maxCount: 1 },
//     { name: 'emirates_id_file', maxCount: 1 },
//     { name: 'hepatitis_b_file', maxCount: 1 },
//     { name: 'bls_file', maxCount: 1 },
//     { name: 'hdc_file', maxCount: 1 },
//     { name: 'dhacda_license_file', maxCount: 1 },
//     { name: 'employment_contract_file', maxCount: 1 },
//     { name: 'confidentiality_contract_file', maxCount: 1 },
//     { name: 'employee_handbook_file', maxCount: 1 },
//     { name: 'dhacda_policies_file', maxCount: 1 }
//   ])(req, res, async (err) => {

//     const { id } = req.params;
//     const { ...fieldsToUpdate } = req.body;

//     const beforeUpdateStaff = await getStaffDetails(id);

//     if (err) {
//       console.error('File upload error:', err);
//       return res.render('staff/editStaff', { errorMessage: 'Error uploading files', staff: beforeUpdateStaff });
//     }

//     if (!id) {
//       return res.render('staff/editStaff', { errorMessage: 'ID is required for updating details.', staff: beforeUpdateStaff });
//     }

//     // Extract file paths
//     const updatedFiles = {
//       passport_file: req.files['passport_file'] ? req.files['passport_file'][0].filename : undefined,
//       visa_file: req.files['visa_file'] ? req.files['visa_file'][0].filename : undefined,
//       exp_letter_file: req.files['exp_letter_file'] ? req.files['exp_letter_file'][0].filename : undefined,
//       license_file: req.files['license_file'] ? req.files['license_file'][0].filename : undefined,
//       emirates_id_file: req.files['emirates_id_file'] ? req.files['emirates_id_file'][0].filename : undefined,
//       hepatitis_b_file: req.files['hepatitis_b_file'] ? req.files['hepatitis_b_file'][0].filename : undefined,
//       bls_file: req.files['bls_file'] ? req.files['bls_file'][0].filename : undefined,
//       hdc_file: req.files['hdc_file'] ? req.files['hdc_file'][0].filename : undefined,
//       dhacda_license_file: req.files['dhacda_license_file'] ? req.files['dhacda_license_file'][0].filename : undefined,
//       employment_contract_file: req.files['employment_contract_file'] ? req.files['employment_contract_file'][0].filename : undefined,
//       confidentiality_contract_file: req.files['confidentiality_contract_file'] ? req.files['confidentiality_contract_file'][0].filename : undefined,
//       employee_handbook_file: req.files['employee_handbook_file'] ? req.files['employee_handbook_file'][0].filename : undefined,
//       dhacda_policies_file: req.files['dhacda_policies_file'] ? req.files['dhacda_policies_file'][0].filename : undefined
//     };

//     // Remove undefined fields to avoid overwriting existing data
//     const cleanedFiles = Object.fromEntries(Object.entries(updatedFiles).filter(([_, value]) => value !== undefined));
//     const cleanedFields = Object.fromEntries(Object.entries(fieldsToUpdate).filter(([_, value]) => value !== undefined && value !== ''));

//     // Combine cleaned fields and files
//     const dataToUpdate = { ...cleanedFields, ...cleanedFiles };

//     if (Object.keys(dataToUpdate).length === 0) {
//       return res.render('staff/editStaff', { errorMessage: 'No data provided for update.', staff: beforeUpdateStaff });
//     }

//     try {
//       const updatedStaff = await StaffDetails.update(dataToUpdate, {
//         where: { id }
//       });

//       if (updatedStaff[0] === 0) {
//         return res.render('staff/editStaff', { errorMessage: 'No staff record found with the given ID.', staff: beforeUpdateStaff });
//       }

//       const staff = await getStaffDetails(id);
//       // console.log('staff >>... ', staff)

//       return res.render('staff/editStaff', {
//         successMessage: 'Staff details updated successfully!',
//         staff, // Pass updated staff data
//       });

//     } catch (err) {
//       console.error('Error during staff update:', err);
//       return res.render('staff/editStaff', { errorMessage: 'Error updating staff details.', staff: beforeUpdateStaff });
//     }
//   });
// };


// Send email after registration

exports.updateStaff = async (req, res) => {
  upload.fields([
    { name: 'passport_file', maxCount: 1 },
    { name: 'visa_file', maxCount: 1 },
    { name: 'exp_letter_file', maxCount: 1 },
    { name: 'license_file', maxCount: 1 },
    { name: 'emirates_id_file', maxCount: 1 },
    { name: 'hepatitis_b_file', maxCount: 1 },
    { name: 'bls_file', maxCount: 1 },
    { name: 'hdc_file', maxCount: 1 },
    { name: 'dhacda_license_file', maxCount: 1 },
    { name: 'employment_contract_file', maxCount: 1 },
    { name: 'confidentiality_contract_file', maxCount: 1 },
    { name: 'employee_handbook_file', maxCount: 1 },
    { name: 'dhacda_policies_file', maxCount: 1 }
  ])(req, res, async (err) => {
    const { id } = req.params;
    let beforeUpdateStaff = await getStaffDetails(id);

    if (err) {
      console.error('File upload error:', err);
      return res.render('staff/editStaff', { errorMessage: 'Error uploading files', staff: beforeUpdateStaff });
    }

    if (!id) {
      return res.render('staff/editStaff', { errorMessage: 'ID is required for updating details.', staff: beforeUpdateStaff });
    }

    const fieldsToUpdate = { ...req.body };

    // Format date fields: convert 'Invalid date' or '' to null
    const dateFields = [
      'passport_expiry', 'visa_expiry', 'exp_letter_date', 'license_expiry', 'emirates_id_expiry',
      'hepatitis_b_expiry', 'bls_file_date', 'hdc_file_date', 'dhacda_license_expiry',
      'employment_contract_expiry', 'confidentiality_contract_expiry', 'employee_handbook_expiry',
      'dhacda_policies_expiry'
    ];

    dateFields.forEach((field) => {
      if (!fieldsToUpdate[field] || fieldsToUpdate[field] === 'Invalid date') {
        fieldsToUpdate[field] = null;
      }
    });

    // Convert multi-select to comma-separated string
    if (Array.isArray(fieldsToUpdate.itcpd)) {
      fieldsToUpdate.itcpd = fieldsToUpdate.itcpd.join(', ');
    }

    // Extract file paths
    const updatedFiles = {
      passport_file: req.files['passport_file']?.[0]?.filename,
      visa_file: req.files['visa_file']?.[0]?.filename,
      exp_letter_file: req.files['exp_letter_file']?.[0]?.filename,
      license_file: req.files['license_file']?.[0]?.filename,
      emirates_id_file: req.files['emirates_id_file']?.[0]?.filename,
      hepatitis_b_file: req.files['hepatitis_b_file']?.[0]?.filename,
      bls_file: req.files['bls_file']?.[0]?.filename,
      hdc_file: req.files['hdc_file']?.[0]?.filename,
      dhacda_license_file: req.files['dhacda_license_file']?.[0]?.filename,
      employment_contract_file: req.files['employment_contract_file']?.[0]?.filename,
      confidentiality_contract_file: req.files['confidentiality_contract_file']?.[0]?.filename,
      employee_handbook_file: req.files['employee_handbook_file']?.[0]?.filename,
      dhacda_policies_file: req.files['dhacda_policies_file']?.[0]?.filename
    };

    // Clean up undefined fields
    const cleanedFiles = Object.fromEntries(Object.entries(updatedFiles).filter(([_, v]) => v !== undefined));
    const cleanedFields = Object.fromEntries(Object.entries(fieldsToUpdate).filter(([_, v]) => v !== undefined && v !== ''));

    const dataToUpdate = { ...cleanedFields, ...cleanedFiles };

    if (Object.keys(dataToUpdate).length === 0) {
      return res.render('staff/editStaff', { errorMessage: 'No data provided for update.', staff: beforeUpdateStaff });
    }

    try {
      const updatedStaff = await StaffDetails.update(dataToUpdate, {
        where: { id }
      });

      if (updatedStaff[0] === 0) {
        return res.render('staff/editStaff', { errorMessage: 'No staff record found with the given ID.', staff: beforeUpdateStaff });
      }

      const staff = await getStaffDetails(id);
      return res.render('staff/editStaff', {
        successMessage: 'Staff details updated successfully!',
        staff
      });

    } catch (err) {
      console.error('Error during staff update:', err);
      return res.render('staff/editStaff', { errorMessage: 'Error updating staff details.', staff: beforeUpdateStaff });
    }
  });
};


exports.createContract = async (req, res) => {
  try {
    const contractData = req.body;

    const newContract = await StaffConfidentialityContract.create(contractData);

          req.flash('success', ' Contract created successfully');
    res.redirect('staff/confidentiality-contract');
  } catch (error) {
    console.error('Error creating KPI:', error);
    req.flash('error', 'Error creating contract');
    res.redirect('staff/confidentiality-contract');


//     res.status(201).json({ message: 'Contract created successfully', data: newContract });
//   } catch (error) {
//     console.error('Error creating contract:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
  }
};

const sendWelcomeEmail = async (email, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or use another SMTP service
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Welcome to our service',
      text: `Hello! Your account has been successfully created. Your password is: ${password}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending email:', err);
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



