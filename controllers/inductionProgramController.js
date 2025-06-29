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

exports.inductionProgramCreate = async (req, res) => {

  // console.log('req.body >>> ', JSON.stringify(req.body))

  // const { ...fieldsToAdd } = req.body;

  try {
    const requestBody = {
      ...req.body
    };
    console.log('requestBody >> ', requestBody)
    const esResponse = await InductionProgram.create(requestBody);
    req.flash('success', 'End Service added successfully....');
    res.redirect('/hr/sip/create');
  } catch (error) {
    console.error('Error creating KPI:', error);
    req.flash('error', 'An error occurred while saving the End Service.');
    res.redirect('/hr/sip/create');
  }


};

exports.renderSipCreatePage = async (req, res) => {
  try {
    const staffList = await StaffDetails.findAll(); // fetch staff list
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
  const esData = await endService.findOne({
    where: { id: esId },
    include: [{
      model: StaffDetails,   // Assuming the name of the staff model is `staffDetails`
      attributes: ['staff_name', 'staff_id', 'ccdetails'], // Specify the columns you want
    }],
  });

  if (esData) {
    // Get the raw object data
    const data = esData.get({ plain: true });

    // Format kpi_date to 'YYYY-MM-DD' if it's a Date object or ISO string
    if (data.procd_norsafrl_date) {
      data.procd_norsafrl_date = new Date(data.procd_norsafrl_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_aorharot_date) {
      data.procd_aorharot_date = new Date(data.procd_aorharot_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_eisacaeiwh_date) {
      data.procd_eisacaeiwh_date = new Date(data.procd_eisacaeiwh_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_hodcadh_date) {
      data.procd_hodcadh_date = new Date(data.procd_hodcadh_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_rocp_date) {
      data.procd_rocp_date = new Date(data.procd_rocp_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_ids_date) {
      data.procd_ids_date = new Date(data.procd_ids_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_fc_date) {
      data.procd_fc_date = new Date(data.procd_fc_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_keys_date) {
      data.procd_keys_date = new Date(data.procd_keys_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_tr_date) {
      data.procd_tr_date = new Date(data.procd_tr_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_soata_date) {
      data.procd_soata_date = new Date(data.procd_soata_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_op_date) {
      data.procd_op_date = new Date(data.procd_op_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_sal_date) {
      data.procd_sal_date = new Date(data.procd_sal_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_gt_date) {
      data.procd_gt_date = new Date(data.procd_gt_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_ul_date) {
      data.procd_ul_date = new Date(data.procd_ul_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_cfoacacf_date) {
      data.procd_cfoacacf_date = new Date(data.procd_cfoacacf_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_fafupfot_date) {
      data.procd_fafupfot_date = new Date(data.procd_fafupfot_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_rchiael_date) {
      data.procd_rchiael_date = new Date(data.procd_rchiael_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_fsprfsp_date) {
      data.procd_fsprfsp_date = new Date(data.procd_fsprfsp_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_colcctlc_date) {
      data.procd_colcctlc_date = new Date(data.procd_colcctlc_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.procd_eosbchce_date) {
      data.procd_eosbchce_date = new Date(data.procd_eosbchce_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }

    return data;
  }
  return null;
};

exports.inductionProgramEdit = async (req, res) => {
  const { id } = req.params;
  try {
    const es = await getInductionProgramDetails(id);
    console.log('es >> ', es)
    if (!es) {
      req.flash('error', 'End Service not found');
      return res.render('hr/induction_program/edit_sip', {
        es,
        errorMessages: req.flash('error'),
        successMessages: []
      });
    }

    return res.render('hr/induction_program/edit_sip', {
      es,
      errorMessages: [],
      successMessages: []
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal Server Error');
    return res.render('hr/induction_program/edit_sip', {
      es,
      errorMessages: req.flash('error'),
      successMessages: []
    });
  }
};

exports.inductionProgramUpdate = async (req, res) => {

  const { id } = req.params;
  const { ...fieldsToUpdate } = req.body;

  const beforeUpdateEndService = await getInductionProgramDetails(id);

  if (!id) {
    req.flash('error', 'ID is required for updating details.');
    return res.render('hr/induction_program/edit_sip', {
      es: beforeUpdateEndService,
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
    return res.render('hr/induction_program/edit_sip', {
      es: beforeUpdateEndService,
      errorMessages: req.flash('error'),
      successMessages: []
    });
    // return res.render('hr/kpi/editKpi', { errorMessages: 'No data provided for update.', staff: beforeUpdateKpi });
  }

  try {
    // console.log('dataToUpdate >>>', dataToUpdate)
    const [updatedEndService] = await endService.update(dataToUpdate, {
      where: { id }
    });

    if (updatedEndService[0] === 0) {
      req.flash('error', 'No End Service record found with the given ID.');
      return res.render('hr/induction_program/edit_sip', {
        es: beforeUpdateEndService,
        errorMessages: req.flash('error'),
        successMessages: []
      });
      // return res.render('hr/kpi/editKpi', { errorMessages: 'No kpi record found with the given ID.', staff: beforeUpdateKpi });
    }

    const endServiceDetails = await getInductionProgramDetails(id);

    req.flash('success', 'End Service details updated successfully!');
    return res.render('hr/induction_program/edit_sip', {
      es: endServiceDetails,
      successMessages: req.flash('success'),
      errorMessages: []
    });

  } catch (err) {
    console.error('Error during end service update:', err);
    req.flash('error', 'Error updating end service details.');
    return res.render('hr/induction_program/edit_sip', {
      es: beforeUpdateEndService,
      errorMessages: req.flash('error'),
      successMessages: []
    });
    // req.flash('error', 'Error updating kpi details.');
    // return res.render('hr/kpi/editKpi', { kpi: beforeUpdateKpi, errorMessages: req.flash('error') });

    // return res.render('hr/kpi/editKpi', { errorMessage: 'Error updating kpi details.', staff: beforeUpdateKpi });
  }

};





