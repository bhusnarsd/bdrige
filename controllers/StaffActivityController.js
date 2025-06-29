const { StaffWarning, StaffDetails, department:DepartmentMdl } = require('../models');
const path = require('path');
const multer = require('multer');
const { Sequelize, Op } = require('sequelize');
const { getWarningList } = require('../utils/staffUtils');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/staff_warnings');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// const getWarningList = async (searchTerm, page = 1, limit = 10) => {
//   const offset = (page - 1) * limit;

//   // Define the `whereCondition` for filtering by `staff_id` or `staff_name`
//   const whereCondition = searchTerm
//     ? {
//         [Op.or]: [
//           { '$StaffDetail.staff_id$': { [Op.iLike]: `%${searchTerm}%` } },  // Use alias "StaffDetail"
//           { '$StaffDetail.staff_name$': { [Op.iLike]: `%${searchTerm}%` } }  // Use alias "StaffDetail"
//         ]
//       }
//     : {};  // No filter if searchTerm is empty

//   const { rows, count } = await StaffWarning.findAndCountAll({
//     include: {
//       model: staffDetails,
//       required: true,  // INNER JOIN between StaffWarning and StaffDetails
//       as: 'StaffDetail' // Define the alias for the include
//     },
//     where: whereCondition,
//     limit,
//     offset,
//   });

//   return { rows, totalCount: count };
// };

exports.listStaffWarning = async (req, res) => {
  const searchTerm = req.query.search || '';  // Get search term from query params
  const page = parseInt(req.query.page) || 1; // Get the current page number
  const limit = parseInt(req.query.limit) || 10; // Get the limit for results per page

  const { rows, totalCount } = await getWarningList(StaffWarning, searchTerm, page, limit);

  const totalPages = Math.ceil(totalCount / limit); // Calculate the total number of pages

  res.render('staff/warning-letter-list', {
    staffList: rows,
    totalPages,
    currentPage: page,
    totalCount,
    searchTerm,
  });
};

// Add Staff Warning
exports.addStaffWarning = async (req, res) => {
  upload.fields([
    { name: 'any_document', maxCount: 1 }
  ])(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.render('staff/warning-letter', { errorMessage: 'Error uploading files' });
    }
    const { staff_id, staff_name, doi, department, issues_concerns, background_info, ecotp, action1, action2, action3, deadline_date, email_to_respond, appropriate_date, response, responded_by, conclusion } = req.body;
    // let any_document = null;

    const anydocument = req.files['any_document'] ? req.files['any_document'][0].filename : null;

    try {
      const departmentObj = await DepartmentMdl.findOne({ where: { name: department } });
      console.log('departmentObj', JSON.stringify(departmentObj))
      if (!departmentObj) {
        // return res.status(400).json({ message: 'Invalid department.' });
        return res.render('staff/warning-letter', { errorMessage: 'Invalid department.' });
      }

      const newStaffWarning = await StaffWarning.create({
        staff_id,
        staff_name,
        doi,
        department_id: departmentObj.id,
        issues_concerns,
        background_info,
        ecotp,
        action1,
        action2,
        action3,
        deadline_date,
        email_to_respond,
        appropriate_date,
        response,
        responded_by,
        conclusion,
        any_document: anydocument,
      });

      const staffList = await StaffDetails.findAll();
return res.render('staff/warning-letter', {
  staffList,
  successMessage: 'Staff warning added successfully.',
  errorMessage: null,
});
      // res.status(201).json({ successMessage: 'Staff warning added successfully.' });
      // return res.render('staff/warning-letter', { successMessage: 'Staff warning added successfully.' });
    } catch (error) {
      console.error(error);
      // res.status(500).json({ errorMessage: 'Error adding staff warning.' });
      return res.render('staff/warning-letter', { errorMessage: 'Error adding staff warning.' });
    }

  });

};

// Edit Staff Warning
exports.editStaffWarning = async (req, res) => {
  const { id, staff_id, staff_name, doi, department, issues_concerns, background_info, ecotp, action1, action2, action3, deadline_date, email_to_respond, appropriate_date, response, responded_by, conclusion } = req.body;
  let any_document = null;

  if (req.file) {
    any_document = req.file.filename;
  }

  try {
    const staffWarning = await StaffWarning.findByPk(id);
    if (!staffWarning) {
      return res.status(404).json({ message: 'Staff warning not found.' });
    }

    const departmentObj = await DepartmentMdl.findOne({ where: { id: department } });
    if (!departmentObj) {
      return res.status(400).json({ message: 'Invalid department.' });
    }

    await StaffWarning.update({
      staff_id,
      staff_name,
      doi,
      department_id: department,
      issues_concerns,
      background_info,
      ecotp,
      action1,
      action2,
      action3,
      deadline_date,
      email_to_respond,
      appropriate_date,
      response,
      responded_by,
      conclusion,
      any_document,
    });

    res.status(200).json({ successMessage: 'Staff warning updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: 'Error updating staff warning.' });
  }
};

// Middleware for file upload
// exports.uploadFile = upload.single('any_document');
exports.renderWarCreatePage = async (req, res) => {
  try {
    const staffList = await StaffDetails.findAll();
    const errorMessage = req.flash('errorMessage');
    const successMessage = req.flash('successMessage');

    res.render('staff/warning-letter', {
      staffList,
      errorMessage: errorMessage[0] || null,
      successMessage: successMessage[0] || null,
    });
  } catch (err) {
    console.error(err);
    res.render('staff/warning-letter', {
      staffList: [],
      errorMessage: 'Failed to load staff list',
      successMessage: null,
    });
  }
};

// exports.renderWarCreatePage = async (req, res) => {
//   try {
//     const staffList = await staffDetails.findAll();

//     const messages = req.flash(); // ✅ only if using connect-flash

//     res.render('staff/warning-letter', {
//       staffList,
//       messages, // ✅ pass it here
//     });
//   } catch (err) {
//     console.error(err);
//     res.render('staff/warning-letter', {
//       staffList: [],
//       messages: { error: 'Failed to load staff list' }, // fallback
//     });
//   }
// };

// Fetch warning letter for editing
exports.editWarningLetterForm = async (req, res) => {
  const { id } = req.params;
  try {
    const warning = await StaffWarning.findOne({
      where: { id },
      include: [{ model: StaffDetails, attributes: ['staff_name', 'staff_id'] }]
    });

    if (!warning) {
      req.flash('error', 'Warning letter not found');
      return res.redirect('/staff/warning-letter/list');
    }

    const staffList = await StaffDetails.findAll(); // For dropdown if needed
    res.render('staff/warning-letter-edit', {
      warning: warning.get({ plain: true }),
      staffList,
      errorMessages:null ,
      successMessages: null,
    });
  } catch (err) {
    console.error('Error loading warning letter:', err);
    req.flash('error', 'Internal Server Error');
    res.redirect('/staff/warning-letter/list');
  }
};

// Handle update
exports.updateWarningLetter = async (req, res) => {
  const { id } = req.params;
  try {
    const updateData = req.body;

    const [updated] = await StaffWarning.update(updateData, { where: { id } });

    if (!updated) {
      req.flash('error', 'No record updated.');
      return res.redirect(`/staff/warning-letter/edit/${id}`);
    }

    req.flash('success', 'Warning letter updated successfully.');
    res.redirect(`/staff/warning-letter/edit/${id}`);
  } catch (err) {
    console.error('Error updating warning letter:', err);
    req.flash('error', 'Error updating data.');
    res.redirect(`/staff/warning-letter/edit/${id}`);
  }
};