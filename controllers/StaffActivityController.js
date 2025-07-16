const { StaffWarning, StaffDetails, Department } = require('../models');
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
  upload.fields([{ name: 'any_document', maxCount: 1 }])(req, res, async (err) => {
    const staffList = await StaffDetails.findAll({ where: { is_deleted: false } });

    if (err) {
      console.error('File upload error:', err);
      return res.render('staff/warning-letter', {
        staffList,
        errorMessage: 'Error uploading files',
        successMessage: null
      });
    }

    const {
      staff_id,
      staff_name,
      doi,
      department,
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
      conclusion
    } = req.body;

    const anydocument = req.files['any_document'] ? req.files['any_document'][0].filename : null;

    try {
      const departmentObj = await Department.findOne({ where: { name: department } });

      if (!departmentObj) {
        return res.render('staff/warning-letter', {
          staffList,
          errorMessage: 'Invalid department.',
          successMessage: null
        });
      }

      await StaffWarning.create({
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

      return res.render('staff/warning-letter', {
        staffList,
        successMessage: 'Staff warning added successfully.',
        errorMessage: null
      });
    } catch (error) {
      console.error(error);
      return res.render('staff/warning-letter', {
        staffList,
        errorMessage: 'Error adding staff warning.',
        successMessage: null
      });
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

    const departmentObj = await Department.findOne({ where: { id: department } });
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
// exports.renderWarCreatePage = async (req, res) => {
//   try {
//     const staffList = await StaffDetails.findAll({ where: { is_deleted: false }});
//     const errorMessage = req.flash('errorMessage');
//     const successMessage = req.flash('successMessage');

//     res.render('staff/warning-letter', {
//       staffList,
//       errorMessage: errorMessage[0] || null,
//       successMessage: successMessage[0] || null,
//     });
//   } catch (err) {
//     console.error(err);
//     res.render('staff/warning-letter', {
//       staffList: [],
//       errorMessage: 'Failed to load staff list',
//       successMessage: null,
//     });
//   }
// };

exports.renderWarCreatePage = async (req, res) => {
  try {
    const staffList = await StaffDetails.findAll({ where: { is_deleted: false } });
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


// Fetch warning letter for editing
exports.editWarningLetterForm = async (req, res) => {
  const warningId = parseInt(req.params.id, 10);
  try {
    const warningRecord = await StaffWarning.findOne({
      where: { id: warningId },
      include: [{
        model: StaffDetails,
        as: 'StaffDetail',          // ← make sure this matches your association!
        attributes: ['staff_id','staff_name']
      }]
    });

    if (!warningRecord) {
      req.flash('error', 'Warning letter not found');
      return res.redirect('/staff/warning-letter/list');
    }

    // Pull out a plain object and re‑shape it
    const warning = warningRecord.get({ plain: true });

    // 1) Copy the StaffDetail name/id to top‐level fields:
    warning.staff_name = warning.StaffDetail.staff_name;
    warning.staff_id   = warning.StaffDetail.staff_id;

    // 2) Format each date as 'YYYY‑MM‑DD' so HTML <input type="date"> will show it.
    ['doi','deadline_date','appropriate_date']
      .forEach(key => {
        if (warning[key]) {
          warning[key] = new Date(warning[key])
                              .toISOString()
                              .split('T')[0];
        } else {
          warning[key] = '';
        }
      });

    // 3) Render
    const staffList = await StaffDetails.findAll({ where: { is_deleted: false } });
    return res.render('staff/warning-letter-edit', {
      warning,
      staffList,
      errorMessages:  req.flash('error'),
      successMessages: req.flash('success'),
    });
  } catch (err) {
    console.error('Error loading warning letter:', err);
    req.flash('error', 'Internal Server Error');
    return res.redirect('/staff/warning-letter/list');
  }
};



// // Handle update
// exports.updateWarningLetter = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const updateData = req.body;

//     // File handling
//     if (req.file) {
//       updateData.any_document = req.file.filename; // Save filename to DB
//     }

//     const [updated] = await StaffWarning.update(updateData, { where: { id } });

//     if (!updated) {
//       req.flash('error', 'No record updated.');
//       return res.redirect(`/staff/warning-letter/edit/${id}`);
//     }

//     req.flash('success', 'Warning letter updated successfully.');
//     res.redirect(`/staff/warning-letter/edit/${id}`);
//   } catch (err) {
//     console.error('Error updating warning letter:', err);
//     req.flash('error', 'Error updating data.');
//     res.redirect(`/staff/warning-letter/edit/${id}`);
//   }
// };


exports.updateWarningLetter = async (req, res) => {
  upload.fields([{ name: 'any_document', maxCount: 1 }])(req, res, async (err) => {
    const { id } = req.params;
    const staffList = await StaffDetails.findAll({ where: { is_deleted: false } });
    const departments = await Department.findAll();

    if (err) {
      console.error('File upload error:', err);
      req.flash('errorMessages', 'Error uploading files');
      return res.redirect(`/staff/warning-letter/edit/${id}`);
    }

    const {
      staff_id,
      staff_name,
      doi,
      department,
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
      conclusion
    } = req.body;

    const any_document = req.files['any_document']?.[0]?.filename;

    try {
      const departmentObj = await Department.findOne({ where: { name: department } });

      if (!departmentObj) {
        req.flash('errorMessages', 'Invalid department.');
        return res.redirect(`/staff/warning-letter/edit/${id}`);
      }

      const updateData = {
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
      };

      // Only update the document if a new file is uploaded
      if (any_document) {
        updateData.any_document = any_document;
      }

      const [updated] = await StaffWarning.update(updateData, { where: { id } });

      if (!updated) {
        req.flash('errorMessages', 'No record updated.');
        return res.redirect(`/staff/warning-letter/edit/${id}`);
      }

      req.flash('successMessages', 'Warning letter updated successfully.');
      res.redirect(`/staff/warning-letter/edit/${id}`);
    } catch (error) {
      console.error('Error updating warning letter:', error);
      req.flash('errorMessages', 'Error updating data.');
      res.redirect(`/staff/warning-letter/edit/${id}`);
    }
  });
};
