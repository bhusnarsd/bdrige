const { StaffDetails, HandBook } = require('../models');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const department = require('../models/department');
const { Sequelize, Op } = require('sequelize');
const { getHandBookList } = require('../utils/staffUtils');

exports.handBookList = async (req, res) => {
  const searchTerm = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { rows, totalCount } = await getHandBookList(HandBook, searchTerm, page, limit);

  console.log('rows >> ', JSON.stringify(rows))

  const totalPages = Math.ceil(totalCount / limit);

  res.render('hr/handbook/hb_list', {
    hbList: rows,
    totalPages,
    currentPage: page,
    totalCount,
    searchTerm,
  });
};

// exports.handBookCreate = async (req, res) => {

//   console.log('req.body >>> ', JSON.stringify(req.body))

//   // const { ...fieldsToAdd } = req.body;

//   try {
//     const requestBody = {
//       ...req.body
//     };

//     const dateFields = [
//       'dob',
//       'spdate'
//     ];

//     // Iterate over the date fields and remove the ones that are empty or invalid
//     dateFields.forEach(field => {
//       if (!req.body[field] || isNaN(Date.parse(req.body[field]))) {
//         delete requestBody[field];  // Remove the field if it's empty or invalid
//       }
//     });

//     // console.log('requestBody >> ', requestBody)

//     const hbResponse = await HandBook.create(requestBody);

//     const hbDetails = await getHandBookDetails(hbResponse.id);

//     req.flash('success', 'Staff Handbook and Code of Conduct added successfully....');
//     res.redirect('/hr/hb/create');
//   } catch (error) {
//     console.error('Error creating Staff Handbook and Code of Conduct:', error);
//     req.flash('error', 'An error occurred while saving the Staff Handbook and Code of Conduct.');
//     res.redirect('/hr/hb/create');
//   }


// };


exports.handBookCreate = async (req, res) => {

  try {
    const requestBody = { ...req.body };
  
    ['dob', 'spdate'].forEach(field => {
      if (!req.body[field] || isNaN(Date.parse(req.body[field]))) {
        delete requestBody[field];
      }
    });
  
    // === Process signature images ===
    const signatures = [
      { field: 'fpsign', canvasId: 'signature-pad', filename: 'FirstPartySignature' },
      { field: 'spsign', canvasId: 'spsign-canvas', filename: 'SecondPartySignature' }
    ];
  
    for (const sig of signatures) {
      const dataUrl = req.body[sig.field];
      if (dataUrl && dataUrl.startsWith('data:image')) {
        const buffer = Buffer.from(dataUrl.split(',')[1], 'base64');
        const dir = path.join(__dirname, '..', 'public', 'uploads', 'signatures', 'handbook');
        fs.mkdirSync(dir, { recursive: true });
        const fileName = `${Date.now()}-${sig.filename}.png`;
        const filePath = path.join(dir, fileName);
        fs.writeFileSync(filePath, buffer);
  
        // Replace the base64 with a relative path
        requestBody[sig.field] = `/uploads/signatures/handbook/${fileName}`;
      }
    }
  
    const hbResponse = await HandBook.create(requestBody);
    // const hbDetails = await getHandBookDetails(hbResponse.id);
  
    req.flash('success', 'Staff Handbook and Code of Conduct added successfully....');
    res.redirect('/hr/hb/create');
  } catch (error) {
    console.error('Error creating Staff Handbook and Code of Conduct:', error);
    req.flash('error', 'An error occurred while saving the Staff Handbook and Code of Conduct.');
    res.redirect('/hr/hb/create');
  }
  

};
exports.renderHandCreatePage = async (req, res) => {
  try {
    const staffList = await StaffDetails.findAll({ where: { is_deleted: false }});

    const messages = req.flash(); // ✅ only if using connect-flash

    res.render('hr/handbook/create', {
      staffList,
      messages, // ✅ pass it here
    });
  } catch (err) {
    console.error(err);
    res.render('hr/handbook/create', {
      staffList: [],
      messages: { error: 'Failed to load staff list' }, // fallback
    });
  }
};

const getHandBookDetails = async (esId) => {
  const esData = await HandBook.findOne({
    where: { id: esId },
    include: [{
      model: StaffDetails,   // Assuming the name of the staff model is `staffDetails`
      attributes: ['staff_name', 'staff_id', 'ccdetails'], // Specify the columns you want
    }],
  });

  if (esData) {
    // Get the raw object data
    const data = esData.get({ plain: true });

    // Format dob to 'YYYY-MM-DD' if it's a Date object or ISO string
    if (data.dob) {
      data.dob = new Date(data.dob).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }

    return data;
  }
  return null;
};

exports.handBookEdit = async (req, res) => {
  const { id } = req.params;
  try {
    const hb = await getHandBookDetails(id);
    console.log('Handbook record >> ', hb)
    if (!hb) {
      req.flash('error', 'Handbook not found');
      return res.render('hr/handbook/edit', {
        hb,
        errorMessages: req.flash('error'),
        successMessages: []
      });
    }

    return res.render('hr/handbook/edit', {
      hb,
      errorMessages: [],
      successMessages: []
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal Server Error');
    return res.render('hr/handbook/edit', {
      hb: null,
      errorMessages: req.flash('error'),
      successMessages: []
    });
  }
};


// exports.handBookEdit = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const es = await getHandBookDetails(id);
//     console.log('es >> ', es)
//     if (!es) {
//       req.flash('error', 'End Service not found');
//       return res.render('hr/hb/edit', {
//         es,
//         errorMessages: req.flash('error'),
//         successMessages: []
//       });
//     }

//     return res.render('hr/hb/edit', {
//       es,
//       errorMessages: [],
//       successMessages: []
//     });
//   } catch (error) {
//     console.error(error);
//     req.flash('error', 'Internal Server Error');
//     return res.render('hr/hb/edit', {
//       es,
//       errorMessages: req.flash('error'),
//       successMessages: []
//     });
//   }
// };

exports.handBookUpdate = async (req, res) => {

  const { id } = req.params;
  const { ...fieldsToUpdate } = req.body;

  const beforeUpdateHandBook = await getHandBookDetails(id);

  if (!id) {
    req.flash('error', 'ID is required for updating details.');
    return res.render('hr/handbook/edit', {
      hb: beforeUpdateHandBook,
      errorMessages: req.flash('error'),
      successMessages: []
    });
  }

  // Remove undefined fields to avoid overwriting existing data
  const cleanedFields = Object.fromEntries(Object.entries(fieldsToUpdate).filter(([_, value]) => value !== undefined && value !== ''));

  // Combine cleaned fields and files
  const dataToUpdate = { ...cleanedFields };

  if (Object.keys(dataToUpdate).length === 0) {
    req.flash('error', 'No data provided for update.');
    return res.render('hr/handbook/edit', {
      hb: beforeUpdateHandBook,
      errorMessages: req.flash('error'),
      successMessages: []
    });
    // return res.render('hr/kpi/editKpi', { errorMessages: 'No data provided for update.', staff: beforeUpdateKpi });
  }

  try {
    // console.log('dataToUpdate >>>', dataToUpdate)
    const [updatedHandBook] = await HandBook.update(dataToUpdate, {
      where: { id }
    });

    if (updatedHandBook[0] === 0) {
      req.flash('error', 'No End Service record found with the given ID.');
      return res.render('hr/handbook/edit', {
        hb: beforeUpdateHandBook,
        errorMessages: req.flash('error'),
        successMessages: []
      });
      // return res.render('hr/kpi/editKpi', { errorMessages: 'No kpi record found with the given ID.', staff: beforeUpdateKpi });
    }

    const handBookDetails = await getHandBookDetails(id);

    req.flash('success', 'End Service details updated successfully!');
    return res.render('hr/handbook/edit', {
      hb: handBookDetails,
      successMessages: req.flash('success'),
      errorMessages: []
    });

  } catch (err) {
    console.error('Error during end service update:', err);
    req.flash('error', 'Error updating end service details.');
    return res.render('hr/handbook/edit', {
      hb: beforeUpdateHandBook,
      errorMessages: req.flash('error'),
      successMessages: []
    });
    // req.flash('error', 'Error updating kpi details.');
    // return res.render('hr/kpi/editKpi', { kpi: beforeUpdateKpi, errorMessages: req.flash('error') });

    // return res.render('hr/kpi/editKpi', { errorMessage: 'Error updating kpi details.', staff: beforeUpdateKpi });
  }

};





