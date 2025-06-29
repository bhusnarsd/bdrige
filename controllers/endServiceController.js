const { StaffDetails, EndService } = require('../models');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const department = require('../models/department');
const { Sequelize, Op } = require('sequelize');
const { getEndServiceList } = require('../utils/staffUtils');

exports.endServiceList = async (req, res) => {
  const searchTerm = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { rows, totalCount } = await getEndServiceList(EndService, searchTerm, page, limit);

  console.log('rows >> ', JSON.stringify(rows))

  const totalPages = Math.ceil(totalCount / limit);

  res.render('hr/end_service/es_list', {
    esList: rows,
    totalPages,
    currentPage: page,
    totalCount,
    searchTerm,
  });
};

exports.endServiceCreate = async (req, res) => {

  // console.log('req.body >>> ', JSON.stringify(req.body))

  // const { ...fieldsToAdd } = req.body;

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

    const esResponse = await EndService.create(requestBody);

    const esDetails = await getEndServiceDetails(esResponse.id);

    req.flash('success', 'End Service added successfully....');
    res.redirect('/hr/es/create');
  } catch (error) {
    console.error('Error creating KPI:', error);
    req.flash('error', 'An error occurred while saving the End Service.');
    res.redirect('/hr/es/create');
  }


};

exports.renderEndCreatePage = async (req, res) => {
  try {
    const staffList = await StaffDetails.findAll(); // fetch staff list
    // console.log("staffList",staffList)
    const messages = req.flash();
    res.render('hr/end_service/create', { staffList, messages, });
  } catch (err) {
    console.error(err);
    res.render('hr/end_service/create', {
      staffList: [],
        messages: { error: 'Failed to load staff list' },
      // errorMessage: 'Failed to load staff list',
    });
  }
};
// const getKpiDetails = async (kpiId) => {  // views\hr\end_service\create.ejs
//   const kpiData = await kpi.findOne({ where: { id: kpiId } });
//   if (kpiData) {
//     return kpiData.get();  // This converts the Sequelize instance to a plain object
//   }
//   return null;
// };

const getEndServiceDetails = async (esId) => {
  const esData = await EndService.findOne({
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

exports.endServiceEdit = async (req, res) => {
  const { id } = req.params;
  try {
    const es = await getEndServiceDetails(id);
    console.log('es >> ', es)
    if (!es) {
      req.flash('error', 'End Service not found');
      return res.render('hr/end_service/edit_es', {
        es,
        errorMessages: req.flash('error'),
        successMessages: []
      });
    }

    return res.render('hr/end_service/edit_es', {
      es,
      errorMessages: [],
      successMessages: []
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal Server Error');
    return res.render('hr/end_service/edit_es', {
      es,
      errorMessages: req.flash('error'),
      successMessages: []
    });
  }
};

exports.endServiceUpdate = async (req, res) => {

  const { id } = req.params;
  const { ...fieldsToUpdate } = req.body;

  const beforeUpdateEndService = await getEndServiceDetails(id);

  if (!id) {
    req.flash('error', 'ID is required for updating details.');
    return res.render('hr/end_service/edit_es', {
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
    return res.render('hr/end_service/edit_es', {
      es: beforeUpdateEndService,
      errorMessages: req.flash('error'),
      successMessages: []
    });
    // return res.render('hr/kpi/editKpi', { errorMessages: 'No data provided for update.', staff: beforeUpdateKpi });
  }

  try {
    // console.log('dataToUpdate >>>', dataToUpdate)
    const [updatedEndService] = await EndService.update(dataToUpdate, {
      where: { id }
    });

    if (updatedEndService[0] === 0) {
      req.flash('error', 'No End Service record found with the given ID.');
      return res.render('hr/end_service/edit_es', {
        es: beforeUpdateEndService,
        errorMessages: req.flash('error'),
        successMessages: []
      });
      // return res.render('hr/kpi/editKpi', { errorMessages: 'No kpi record found with the given ID.', staff: beforeUpdateKpi });
    }

    const endServiceDetails = await getEndServiceDetails(id);

    req.flash('success', 'End Service details updated successfully!');
    return res.render('hr/end_service/edit_es', {
      es: endServiceDetails,
      successMessages: req.flash('success'),
      errorMessages: []
    });

  } catch (err) {
    console.error('Error during end service update:', err);
    req.flash('error', 'Error updating end service details.');
    return res.render('hr/end_service/edit_es', {
      es: beforeUpdateEndService,
      errorMessages: req.flash('error'),
      successMessages: []
    });
    // req.flash('error', 'Error updating kpi details.');
    // return res.render('hr/kpi/editKpi', { kpi: beforeUpdateKpi, errorMessages: req.flash('error') });

    // return res.render('hr/kpi/editKpi', { errorMessage: 'Error updating kpi details.', staff: beforeUpdateKpi });
  }

};





