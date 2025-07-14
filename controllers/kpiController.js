const { Kpi, StaffDetails } = require('../models');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const department = require('../models/department');
const { Sequelize, Op } = require('sequelize');
const { getListWithStaffDetails } = require('../utils/staffUtils');
// const browser = await puppeteer.launch({
//   headless: true,
//   args: ['--no-sandbox', '--disable-setuid-sandbox']
// });


const getKpiList = async (searchTerm, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const whereCondition = searchTerm
    ? {
      department: { [Op.iLike]: `%${searchTerm}%` }, // Search by staff name
    }
    : {};

  const { rows, count } = await Kpi.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
  });

  return { rows, totalCount: count };

};

exports.kpiList = async (req, res) => {
  const searchTerm = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { rows, totalCount } = await getListWithStaffDetails(Kpi, searchTerm, page, limit);

  console.log('rows >> ', JSON.stringify(rows))

  const totalPages = Math.ceil(totalCount / limit);

  res.render('hr/kpi/kpi_list', {
    kpiList: rows,
    totalPages,
    currentPage: page,
    totalCount,
    searchTerm,
  });
};

function parseDate(val) {
  if (!val) return null;                 // empty string or undefined → null
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;  // invalid → null, valid → Date
}
exports.kpiCreate = async (req, res) => {
  console.log('req.body >>>', JSON.stringify(req.body));

  // Destructure form fields
  const { staff_id, kpi_date, department, e_period, kpi_text1, kpi_text2, kpi_text3, kpi_text4, kpi_text5,
          rating_scale, trg1_art, trg1_rwad, trg1_rws, trg1_mbc, trg1_ppc, trg1_sum,
          trg2_pos, trg2_sft, trg2_ccapc, trg2_caos, trg2_ps, trg2_counslng, trg2_sum,
          trg3_cs, trg3_dm, trg3_init, trg3_cp, trg3_gps, trg3_tw, trg3_sum,
          sasndtq1, sasndtq2, sasndtq3, sasndtq4, sasndtq5, sasndtq6,
          trg_total, ps_scale } = req.body;

          const safeKpiDate       = parseDate(req.body.kpi_date);
          const safeDeadlineDate  = parseDate(req.body.deadline_date);
          const safeAppropriate   = parseDate(req.body.appropriate_date);
  // Canvas signature fields
  const images = [
    { field: 'hr_sign', input: 'hr_sign_input', filename: 'hrSignature' },
    { field: 'staff_sign', input: 'staff_sign_input', filename: 'staffSignature' },
    { field: 'hod_sign', input: 'hod_sign_input', filename: 'hodSignature' },
    { field: 'director_sign', input: 'director_sign_input', filename: 'directorSignature' },
    { field: 'staff_sign1', input: 'staff_sign1_input', filename: 'staffSignature1' },
    { field: 'hod_sign1', input: 'hod_sign1_input', filename: 'hodSignature1' }
  ];

  try {
    // Process base64 images
    const imagePaths = {};
    for (const img of images) {
      const dataUrl = req.body[img.input];
      if (dataUrl) {
        const buffer = Buffer.from(dataUrl.split(',')[1], 'base64');
        const signatureDir = path.join(__dirname, '..', 'public', 'uploads', 'signatures', 'kpi');
        fs.mkdirSync(signatureDir, { recursive: true });
        const imageName = `${Date.now()}-${img.filename}.png`;
        const filePath = path.join(signatureDir, imageName);
        fs.writeFileSync(filePath, buffer);
        imagePaths[img.field] = filePath;
      }
    }

    // Create DB record
    const newKpi = await Kpi.create({
      staff_id, kpi_date: safeKpiDate, department, e_period,
      kpi_text1, kpi_text2, kpi_text3, kpi_text4, kpi_text5,
      rating_scale, trg1_art, trg1_rwad, trg1_rws, trg1_mbc, trg1_ppc, trg1_sum,
      trg2_pos, trg2_sft, trg2_ccapc, trg2_caos, trg2_ps, trg2_counslng, trg2_sum,
      trg3_cs, trg3_dm, trg3_init, trg3_cp, trg3_gps, trg3_tw, trg3_sum,
      sasndtq1, sasndtq2, sasndtq3, sasndtq4, sasndtq5, sasndtq6,
      trg_total, ps_scale,
      deadline_date: safeDeadlineDate,
      appropriate_date: safeAppropriate,
      hr_sign: imagePaths.hr_sign || null,
      staff_sign: imagePaths.staff_sign || null,
      hod_sign: imagePaths.hod_sign || null,
      director_sign: imagePaths.director_sign || null,
      staff_sign1: imagePaths.staff_sign1 || null,
      hod_sign1: imagePaths.hod_sign1 || null
    });

    // Fetch details for template
    const kpiDetails = await getKpiDetails(newKpi.id);
    const StaffDetail = kpiDetails.StaffDetail || {
      staff_id,
      staff_name: req.body.staff_name || '',
      staff_ccdetails: req.body.current_phone || ''
    };

    // Render EJS to HTML
    const templateData = {
      ...kpiDetails,
      StaffDetail,
      department,
      e_period,
      ...Object.fromEntries(Object.entries(imagePaths).map(([field, p]) => [field, `/uploads/signatures/kpi/${path.basename(p)}`]))
    };
    const html = await ejs.renderFile(
      path.join(__dirname, '..', 'views', 'hr', 'kpi', 'kpi_template.ejs'),
      templateData
    );

    // Launch Puppeteer with bundled Chromium
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: puppeteer.executablePath()
    });
    const page = await browser.newPage();
    await page.setContent(html);

    // Generate PDF buffer
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // Write PDF to disk
    const pdfDir = path.join(__dirname, '..', 'public', 'uploads', 'kpi');
    fs.mkdirSync(pdfDir, { recursive: true });
    const pdfName = `kpi_${Date.now()}.pdf`;
    const pdfPath = path.join(pdfDir, pdfName);
    fs.writeFileSync(pdfPath, pdfBuffer);

    // Save PDF path in DB
    await newKpi.update({ pdf_path: `/uploads/kpi/${pdfName}` });

    req.flash('success', 'KPI added successfully.');
    res.redirect('/hr/kpi/create');
  } catch (error) {
    console.error('Error creating KPI:', error);
    req.flash('error', 'An error occurred while saving the KPI.');
    res.redirect('/hr/kpi/create');
  }
};


const getKpiDetails = async (kpiId) => {
  const kpiData = await Kpi.findOne({
    where: { id: kpiId },
    include: [{
      model: StaffDetails,
      as: 'StaffDetail',  // ✅ Must match the alias in association
      attributes: ['id', 'staff_id', 'staff_name', 'ccdetails']
    }]
  });

  
  if (kpiData) {
    const data = kpiData.get({ plain: true });

    if (data.kpi_date) {
      data.kpi_date = new Date(data.kpi_date).toISOString().split('T')[0];
    }

    const formatPath = (path) => path?.replace(/\\/g, '/').replace('public', '');

    data.staff_sign = formatPath(data.staff_sign);
    data.hod_sign = formatPath(data.hod_sign);
    data.hr_sign = formatPath(data.hr_sign);
    data.director_sign = formatPath(data.director_sign);
    data.staff_sign1 = formatPath(data.staff_sign1);
    data.hod_sign1 = formatPath(data.hod_sign1);

    return data;
  }
  return null;
};

// const getKpiDetails = async (kpiId) => {
//   const kpiData = await kpi.findOne({
//     where: { id: kpiId },
//     include: [{
//       model: staffDetails,   // Assuming the name of the staff model is `staffDetails`
//       attributes: ['staff_name', 'staff_id', 'ccdetails'], // Specify the columns you want
//     }],
//   });

//   if (kpiData) {
//     // Get the raw object data
//     const data = kpiData.get({ plain: true });

//     // Format kpi_date to 'YYYY-MM-DD' if it's a Date object or ISO string
//     if (data.kpi_date) {
//       data.kpi_date = new Date(data.kpi_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
//     }

//     // Convert the staff_sign path to use forward slashes and make sure it's accessible via URL
//     if (data.staff_sign) {
//       data.staff_sign = data.staff_sign.replace(/\\/g, '/').replace('public', '');
//     }
//     if (data.hod_sign) {
//       data.hod_sign = data.hod_sign.replace(/\\/g, '/').replace('public', '');
//     }
//     if (data.hr_sign) {
//       data.hr_sign = data.hr_sign.replace(/\\/g, '/').replace('public', '');
//     }
//     if (data.director_sign) {
//       data.director_sign = data.director_sign.replace(/\\/g, '/').replace('public', '');
//     }
//     if (data.staff_sign1) {
//       data.staff_sign1 = data.staff_sign1.replace(/\\/g, '/').replace('public', '');
//     }
//     if (data.hod_sign1) {
//       data.hod_sign1 = data.hod_sign1.replace(/\\/g, '/').replace('public', '');
//     }

//     return data;
//   }
//   return null;
// };

exports.editKpi = async (req, res) => {
  const { id } = req.params;
  try {
    const kpi = await getKpiDetails(id);
    console.log('kpi >> ', kpi)
    if (!kpi) {
      req.flash('error', 'KPI not found');
      return res.render('hr/kpi/editKpi', {
        kpi,
        errorMessages: req.flash('error'),
        successMessages: []
      });
      // return res.status(404).render('error', { message: 'KPI not found' });
    }

    // req.flash('success', 'KPI not found');
    return res.render('hr/kpi/editKpi', {
      kpi,
      errorMessages: [],
      successMessages: []
    });
    // res.render('hr/kpi/editKpi', { kpi, messages: req.flash() });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal Server Error');
    return res.render('hr/kpi/editKpi', {
      kpi,
      errorMessages: req.flash('error'),
      successMessages: []
    });
    // res.status(500).render('error', { message: 'Internal Server Error' });
  }
  // res.render('hr/kpi/editKpi', { messages: req.flash() });
};

exports.kpiUpdate = async (req, res) => {

  const { id } = req.params;
  const { ...fieldsToUpdate } = req.body;

  const beforeUpdateKpi = await getKpiDetails(id);

  if (!id) {
    req.flash('error', 'ID is required for updating details.');
    return res.render('hr/kpi/editKpi', {
      kpi: beforeUpdateKpi,
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
    return res.render('hr/kpi/editKpi', {
      kpi: beforeUpdateKpi,
      errorMessages: req.flash('error'),
      successMessages: []
    });
    // return res.render('hr/kpi/editKpi', { errorMessages: 'No data provided for update.', staff: beforeUpdateKpi });
  }

  try {
    // console.log('dataToUpdate >>>', dataToUpdate)
    const [updatedKpi] = await Kpi.update(dataToUpdate, {
      where: { id }
    });

    if (updatedKpi[0] === 0) {
      req.flash('error', 'No KPI record found with the given ID.');
      return res.render('hr/kpi/editKpi', {
        kpi: beforeUpdateKpi,
        errorMessages: req.flash('error'),
        successMessages: []
      });
      // return res.render('hr/kpi/editKpi', { errorMessages: 'No kpi record found with the given ID.', staff: beforeUpdateKpi });
    }

    const kpiDetails = await getKpiDetails(id);

    // Path to your EJS template file
    const ejsTemplatePath = path.join(__dirname, '..', 'views', 'hr', 'kpi', 'kpi_template.ejs');

    // Prepare data to pass to the template
    const templateData = {
      ...kpiDetails,
      hr_sign: `http://localhost:3000/uploads/signatures/kpi/${path.basename(kpiDetails.hr_sign)}`,
      staff_sign: `http://localhost:3000/uploads/signatures/kpi/${path.basename(kpiDetails.staff_sign)}`,
      hod_sign: `http://localhost:3000/uploads/signatures/kpi/${path.basename(kpiDetails.hod_sign)}`,
      director_sign: `http://localhost:3000/uploads/signatures/kpi/${path.basename(kpiDetails.director_sign)}`,
      staff_sign1: `http://localhost:3000/uploads/signatures/kpi/${path.basename(kpiDetails.staff_sign1)}`,
      hod_sign1: `http://localhost:3000/uploads/signatures/kpi/${path.basename(kpiDetails.hod_sign1)}`,
    };

    // Render the EJS template with dynamic data
    const htmlContent = await ejs.renderFile(ejsTemplatePath, templateData);

    // Log the image paths to verify
    console.log('Template data with image paths:', templateData);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent);

    // Ensure the target directory exists
    const pdfDir = path.join(__dirname, '..', 'public', 'uploads', 'kpi');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const pdfFileName = `kpi_report_${Date.now()}.pdf`;
    const pdfPath = path.join(pdfDir, pdfFileName);
    await page.pdf({ path: pdfPath, format: 'A4' });

    await browser.close();

    // Optionally, store the PDF path in your database or send it as a response
    // Example: storing the path in the database
    try {
      console.log('pdfFileName >> ', pdfFileName)
      await Kpi.update({ pdf_path: `public/uploads/kpi/${pdfFileName}` });
    } catch (error) {
      console.error("Error updating PDF path:", error);
    }



    req.flash('success', 'KPI details updated successfully!');
    return res.render('hr/kpi/editKpi', {
      kpi: kpiDetails,
      successMessages: req.flash('success'),
      errorMessages: []
    });

  } catch (err) {
    console.error('Error during kpi update:', err);
    req.flash('error', 'Error updating kpi details.');
    return res.render('hr/kpi/editKpi', {
      kpi: beforeUpdateKpi,
      errorMessages: req.flash('error'),
      successMessages: []
    });
    // req.flash('error', 'Error updating kpi details.');
    // return res.render('hr/kpi/editKpi', { kpi: beforeUpdateKpi, errorMessages: req.flash('error') });

    // return res.render('hr/kpi/editKpi', { errorMessage: 'Error updating kpi details.', staff: beforeUpdateKpi });
  }

};


exports.renderKPICreatePage = async (req, res) => {
  try {
    const staffList = await StaffDetails.findAll({ where: { is_deleted: false }});

    const messages = req.flash(); // ✅ only if using connect-flash

    res.render('hr/kpi/kpi', {
      staffList,
      messages, // ✅ pass it here
    });
  } catch (err) {
    console.error(err);
    res.render('hr/kpi/kpi', {
      staffList: [],
      messages: { error: 'Failed to load staff list' }, // fallback
    });
  }
};




