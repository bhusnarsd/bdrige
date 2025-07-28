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
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}


exports.kpiCreate = async (req, res) => {
  try {
    console.log('req.body >>>', JSON.stringify(req.body));

    const {
      staff_id, kpi_date, department, e_period,
      kpi_text1, kpi_text2, kpi_text3, kpi_text4, kpi_text5,
      rating_scale, trg1_art, trg1_rwad, trg1_rws, trg1_mbc, trg1_ppc, trg1_sum,
      trg2_pos, trg2_sft, trg2_ccapc, trg2_caos, trg2_ps, trg2_counslng, trg2_sum,
      trg3_cs, trg3_dm, trg3_init, trg3_cp, trg3_gps, trg3_tw, trg3_sum,
      sasndtq1, sasndtq2, sasndtq3, sasndtq4, sasndtq5, sasndtq6,
      trg_total, ps_scale,
      staff_name, current_phone
    } = req.body;

    const safeKpiDate = parseDate(kpi_date);
    const safeDeadlineDate = parseDate(req.body.deadline_date);
    const safeAppropriateDate = parseDate(req.body.appropriate_date);

    const signatureFields = [
      { name: 'staff_sign', filename: 'Staff' },
      { name: 'hod_sign', filename: 'HOD' },
      { name: 'hr_sign', filename: 'HR' },
      { name: 'director_sign', filename: 'Director' },
      { name: 'staff_sign1', filename: 'Staff1' },
      { name: 'hod_sign1', filename: 'HOD1' },
    ];

    const imagePaths = {};
    const missingSignatures = [];

    for (const sig of signatureFields) {
      const dataUrl = req.body[sig.name];
      console.log(`Processing signature ${sig.name}:`, dataUrl ? `${dataUrl.substring(0, 50)}...` : 'null/undefined');
      
      if (dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:image') && dataUrl.length > 1000) {
        try {
          const base64Data = dataUrl.split(',')[1];
          if (!base64Data) {
            console.error(`Invalid base64 data for ${sig.name}`);
            missingSignatures.push(sig.name);
            continue;
          }
          
          const buffer = Buffer.from(base64Data, 'base64');
          const signatureDir = path.join(__dirname, '..', 'public', 'uploads', 'signatures', 'kpi');
          fs.mkdirSync(signatureDir, { recursive: true });
          const fileName = `${Date.now()}-${sig.filename}.png`;
          const filePath = path.join(signatureDir, fileName);
          fs.writeFileSync(filePath, buffer);
          imagePaths[sig.name] = `/uploads/signatures/kpi/${fileName}`;
          console.log(`Successfully saved signature ${sig.name} to ${fileName}`);
        } catch (error) {
          console.error(`Error processing signature ${sig.name}:`, error);
          missingSignatures.push(sig.name);
        }
      } else {
        console.error(`Invalid or missing signature data for ${sig.name}:`, {
          exists: !!dataUrl,
          type: typeof dataUrl,
          startsWithDataImage: dataUrl ? dataUrl.startsWith('data:image') : false,
          length: dataUrl ? dataUrl.length : 0
        });
        missingSignatures.push(sig.name);
      }
    }

    // Check if any required signatures are missing
    if (missingSignatures.length > 0) {
      console.error('Missing or invalid signatures:', missingSignatures);
      req.flash('error', `Missing or invalid signatures: ${missingSignatures.join(', ')}. Please ensure all signatures are properly drawn and try again.`);
      return res.redirect('/hr/kpi/create');
    }

    const newKpi = await Kpi.create({
      staff_id, kpi_date: safeKpiDate, department, e_period,
      kpi_text1, kpi_text2, kpi_text3, kpi_text4, kpi_text5,
      rating_scale, trg1_art, trg1_rwad, trg1_rws, trg1_mbc, trg1_ppc, trg1_sum,
      trg2_pos, trg2_sft, trg2_ccapc, trg2_caos, trg2_ps, trg2_counslng, trg2_sum,
      trg3_cs, trg3_dm, trg3_init, trg3_cp, trg3_gps, trg3_tw, trg3_sum,
      sasndtq1, sasndtq2, sasndtq3, sasndtq4, sasndtq5, sasndtq6,
      trg_total, ps_scale,
      deadline_date: safeDeadlineDate,
      appropriate_date: safeAppropriateDate,
      staff_sign: imagePaths.staff_sign || null,
      hod_sign: imagePaths.hod_sign || null,
      hr_sign: imagePaths.hr_sign || null,
      director_sign: imagePaths.director_sign || null,
      staff_sign1: imagePaths.staff_sign1 || null,
      hod_sign1: imagePaths.hod_sign1 || null
    });

    const kpiDetails = await getKpiDetails(newKpi.id);

    const StaffDetail = kpiDetails.StaffDetail || {
      staff_id,
      staff_name: staff_name || '',
      staff_ccdetails: current_phone || ''
    };

    const templateData = {
      ...kpiDetails,
      StaffDetail,
      department,
      e_period,
      ...imagePaths
    };

    const html = await ejs.renderFile(
      path.join(__dirname, '..', 'views', 'hr', 'kpi', 'kpi_template.ejs'),
      templateData
    );

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: puppeteer.executablePath()
    });

    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    const pdfDir = path.join(__dirname, '..', 'public', 'uploads', 'kpi');
    fs.mkdirSync(pdfDir, { recursive: true });
    const pdfName = `kpi_${Date.now()}.pdf`;
    const pdfPath = path.join(pdfDir, pdfName);
    fs.writeFileSync(pdfPath, pdfBuffer);

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
      as: 'StaffDetail',
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

  // Prevent overwriting staff_id if not intended
  delete dataToUpdate.staff_id;

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
    const StaffDetail = kpiDetails.StaffDetail || {
      staff_id: fieldsToUpdate.staff_id || '',
      staff_name: fieldsToUpdate.staff_name || '',
      staff_ccdetails: fieldsToUpdate.current_phone || ''
    };
    // Path to your EJS template file
    const ejsTemplatePath = path.join(__dirname, '..', 'views', 'hr', 'kpi', 'kpi_template.ejs');

    // Prepare data to pass to the template
    const templateData = {
      ...kpiDetails,
      StaffDetail,
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
      await Kpi.update(
        { pdf_path: `/uploads/kpi/${pdfFileName}` },
        { where: { id } }
      );
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
    const staffList = await StaffDetails.findAll({ where: { is_deleted: false } });

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
