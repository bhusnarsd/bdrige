const { StaffDetails, endService, InductionProgram } = require('../models');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const department = require('../models/department');
const { Sequelize, Op } = require('sequelize');
const { getInductionProgramList } = require('../utils/staffUtils');

exports.inductionProgramList = async (req, res) => {
  const searchTerm = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { rows, totalCount } = await getInductionProgramList(InductionProgram, searchTerm, page, limit);

  console.log('rows >> ', JSON.stringify(rows))

  const totalPages = Math.ceil(totalCount / limit);

  res.render('hr/induction_program/sip_list', {
    esList: rows,
    totalPages,
    currentPage: page,
    totalCount,
    searchTerm,
  });
};

// exports.inductionProgramCreate = async (req, res) => {
//   try {

//         const signatureFields = [
//           { name: 'emp_sign', filename: 'EMP' },
//           { name: 'hr_clinic_sign', filename: 'HR' },
//           { name: 'sid_fparty_sign', filename: 'SSIGN' },
//         ];
    
//         const imagePaths = {};
    
//         for (const sig of signatureFields) {
//           const dataUrl = req.body[sig.name];
//           if (dataUrl && dataUrl.startsWith('data:image')) {
//             const buffer = Buffer.from(dataUrl.split(',')[1], 'base64');
//             const signatureDir = path.join(__dirname, '..', 'public', 'uploads', 'signatures', 'kpi');
//             fs.mkdirSync(signatureDir, { recursive: true });
//             const fileName = `${Date.now()}-${sig.filename}.png`;
//             const filePath = path.join(signatureDir, fileName);
//             fs.writeFileSync(filePath, buffer);
//             imagePaths[sig.name] = `/uploads/signatures/kpi/${fileName}`;
//           }
//         }
//     const requestBody = {
//       // ...req.body
//     };
//     console.log('requestBody >> ', requestBody)
//     const esResponse = await InductionProgram.create(requestBody);
//     req.flash('success', 'End Service added successfully....');
//     res.redirect('/hr/sip/create');
//   } catch (error) {
//     console.error('Error creating KPI:', error);
//     req.flash('error', 'An error occurred while saving the End Service.');
//     res.redirect('/hr/sip/create');
//   }


// };

exports.inductionProgramCreate = async (req, res) => {
  try {
    const signatureFields = [
      { name: 'emp_sign', filename: 'EMP' },
      { name: 'hr_clinic_sign', filename: 'HR' },
      { name: 'sid_fparty_sign', filename: 'SSIGN' },
    ];
    const imagePaths = {};
    for (const sig of signatureFields) {
      const dataUrl = req.body[sig.name];
      if (dataUrl && dataUrl.startsWith('data:image')) {
        const buffer = Buffer.from(dataUrl.split(',')[1], 'base64');
        const signatureDir = path.join(__dirname, '..', 'public', 'uploads', 'signatures', 'kpi');
        fs.mkdirSync(signatureDir, { recursive: true });

        const fileName = `${Date.now()}-${sig.filename}.png`;
        const filePath = path.join(signatureDir, fileName);
        fs.writeFileSync(filePath, buffer);

        // Save the relative URL path
        imagePaths[sig.name] = `/uploads/signatures/kpi/${fileName}`;
      }
    }

    const requestBody = {
      ...req.body,
      emp_sign: imagePaths.emp_sign || null,
      hr_clinic_sign: imagePaths.hr_clinic_sign || null,
      sid_fparty_sign: imagePaths.sid_fparty_sign || null
    };
    console.log('requestBody >> ', requestBody);
    const esResponse = await InductionProgram.create(requestBody);
    req.flash('success', 'Induction Program added successfully.');
    res.redirect('/hr/sip/create');
  } catch (error) {
    console.error('Error creating Induction Program:', error);
    req.flash('error', 'An error occurred while saving the Induction Program.');
    res.redirect('/hr/sip/create');
  }
};


exports.renderSipCreatePage = async (req, res) => {
  try {
    const staffList = await StaffDetails.findAll({ where: { is_deleted: false }}); // fetch staff list
    // console.log("staffList",staffList)
    res.render('hr/induction_program/create', { staffList });
  } catch (err) {
    console.error(err);
    res.render('hr/induction_program/create', {
      staffList: [],
      errorMessage: 'Failed to load staff list',
    });
  }
};


const getInductionProgramDetails = async (esId) => {
  const esData = await InductionProgram.findOne({
    where: { id: esId },
    include: [{
      model: StaffDetails,   // Assuming the name of the staff model is `staffDetails`
      attributes: ['staff_name', 'staff_id', 'ccdetails'], // Specify the columns you want
    }],
  });

  if (esData) {
    // Get the raw object data
    const data = esData.get({ plain: true });
    return data;
  }
  return null;
};
exports.inductionProgramEdit = async (req, res) => {
  const { id } = req.params;

  try {
    const induction = await getInductionProgramDetails(id);

    console.log('es >> ', induction);

    if (!induction) {
      req.flash('error', 'End Service not found');
      return res.render('hr/induction_program/edit', {
        induction: null,
        errorMessages: req.flash('error'),
        successMessages: []
      });
    }

    // Format dates if they exist
    if (induction.emp_sign_date) {
      induction.emp_sign_date = new Date(induction.emp_sign_date).toISOString().split('T')[0];
    }
    if (induction.sid_sparty_date) {
      induction.sid_sparty_date = new Date(induction.sid_sparty_date).toISOString().split('T')[0];
    }
    if (induction.hr_clinic_sign_date) {
      induction.hr_clinic_sign_date = new Date(induction.hr_clinic_sign_date).toISOString().split('T')[0];
    }
    return res.render('hr/induction_program/edit', {
      induction,
      errorMessages: [],
      successMessages: []
    });

  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal Server Error');
    return res.render('hr/induction_program/edit', {
      induction: null,
      errorMessages: req.flash('error'),
      successMessages: []
    });
  }
};

// exports.inductionProgramUpdate = async (req, res) => {

//   const { id } = req.params;
//   const { ...fieldsToUpdate } = req.body;

//   const beforeUpdateEndService = await getInductionProgramDetails(id);

//   if (!id) {
//     req.flash('error', 'ID is required for updating details.');
//     return res.render('hr/induction_program/edit', {
//       induction: beforeUpdateEndService,
//       errorMessages: req.flash('error'),
//       successMessages: []
//     });
//   }

//   // Remove undefined fields to avoid overwriting existing data
//   const cleanedFields = Object.fromEntries(Object.entries(fieldsToUpdate).filter(([_, value]) => value !== undefined && value !== ''));

//   // Combine cleaned fields and files
//   const dataToUpdate = { ...cleanedFields };

//   if (Object.keys(dataToUpdate).length === 0) {
//     req.flash('error', 'No data provided for update.');
//     return res.render('hr/induction_program/edit', {
//       induction: beforeUpdateEndService,
//       errorMessages: req.flash('error'),
//       successMessages: []
//     });
//     // return res.render('hr/kpi/editKpi', { errorMessages: 'No data provided for update.', staff: beforeUpdateKpi });
//   }

//   try {
//     // console.log('dataToUpdate >>>', dataToUpdate)
//     const [updatedEndService] = await InductionProgram.update(dataToUpdate, {
//       where: { id }
//     });

//     if (updatedEndService[0] === 0) {
//       req.flash('error', 'No End Service record found with the given ID.');
//       return res.render('hr/induction_program/edit', {
//         induction: beforeUpdateEndService,
//         errorMessages: req.flash('error'),
//         successMessages: []
//       });
//       // return res.render('hr/kpi/editKpi', { errorMessages: 'No kpi record found with the given ID.', staff: beforeUpdateKpi });
//     }

//     const endServiceDetails = await getInductionProgramDetails(id);

//     req.flash('success', 'End Service details updated successfully!');
//     return res.render('hr/induction_program/edit', {
//       induction: endServiceDetails,
//       successMessages: req.flash('success'),
//       errorMessages: []
//     });

//   } catch (err) {
//     console.error('Error during end service update:', err);
//     req.flash('error', 'Error updating end service details.');
//     return res.render('hr/induction_program/edit', {
//       induction: beforeUpdateEndService,
//       errorMessages: req.flash('error'),
//       successMessages: []
//     });
//     // req.flash('error', 'Error updating kpi details.');
//     // return res.render('hr/kpi/editKpi', { kpi: beforeUpdateKpi, errorMessages: req.flash('error') });

//     // return res.render('hr/kpi/editKpi', { errorMessage: 'Error updating kpi details.', staff: beforeUpdateKpi });
//   }

// };


exports.inductionProgramUpdate = async (req, res) => {
  const { id } = req.params;
  const { ...fieldsToUpdate } = req.body;

  const beforeUpdateEndService = await getInductionProgramDetails(id);

  if (!id) {
    req.flash('error', 'ID is required for updating details.');
    return res.render('hr/induction_program/edit', {
      induction: beforeUpdateEndService,
      errorMessages: req.flash('error'),
      successMessages: []
    });
  }

  // Remove undefined, empty string fields and skip signature fields
  const cleanedFields = Object.fromEntries(
    Object.entries(fieldsToUpdate).filter(([key, value]) =>
      value !== undefined &&
      value !== '' &&
      !['emp_sign', 'hr_clinic_sign', 'sid_fparty_sign'].includes(key)
    )
  );

  const dataToUpdate = { ...cleanedFields };

  if (Object.keys(dataToUpdate).length === 0) {
    req.flash('error', 'No data provided for update.');
    return res.render('hr/induction_program/edit', {
      induction: beforeUpdateEndService,
      errorMessages: req.flash('error'),
      successMessages: []
    });
  }

  try {
    const [updatedEndService] = await InductionProgram.update(dataToUpdate, {
      where: { id }
    });

    if (updatedEndService === 0) {
      req.flash('error', 'No End Service record found with the given ID.');
      return res.render('hr/induction_program/edit', {
        induction: beforeUpdateEndService,
        errorMessages: req.flash('error'),
        successMessages: []
      });
    }

    const endServiceDetails = await getInductionProgramDetails(id);

    req.flash('success', 'End Service details updated successfully!');
    return res.render('hr/induction_program/edit', {
      induction: endServiceDetails,
      successMessages: req.flash('success'),
      errorMessages: []
    });

  } catch (err) {
    console.error('Error during end service update:', err);
    req.flash('error', 'Error updating end service details.');
    return res.render('hr/induction_program/edit', {
      induction: beforeUpdateEndService,
      errorMessages: req.flash('error'),
      successMessages: []
    });
  }
};



