const { DisputeManagement, StaffDetails } = require('../models');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const department = require('../models/department');
const { Sequelize, Op } = require('sequelize');
const { getDisputeList } = require('../utils/staffUtils');

exports.disputeList = async (req, res) => {
  const searchTerm = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { rows, totalCount } = await getDisputeList(DisputeManagement, searchTerm, page, limit);

  console.log('rows >> ', JSON.stringify(rows))

  const totalPages = Math.ceil(totalCount / limit);

  res.render('hr/dispute/dispute_list', {
    disputeList: rows,
    totalPages,
    currentPage: page,
    totalCount,
    searchTerm,
  });
};

exports.disputeCreate = async (req, res) => {

  // console.log('req.body >>> ', JSON.stringify(req.body))

  const { staff_id,
    doi,
    concern,
    email_to,
    addressed_date,
    dept,
    response_date,
    responded_by,
    conclusion } = req.body;

  try {
    const disputeResponse = await DisputeManagement.create({
      staff_id,
      doi,
      concern,
      email_to,
      addressed_date,
      dept,
      response_date,
      responded_by,
      conclusion
    });

    const kpiDetails = await getDisputeDetails(disputeResponse.id);

    req.flash('success', 'Dispute added successfully....');
    res.redirect('/hr/dispute/create');
  } catch (error) {
    console.error(error);
    // res.status(500).json({ errorMessage: 'Error adding staff warning.' });
    // return res.render('hr/kpi', { errorMessage: 'Error adding kpi.' });
    console.error('Error creating KPI:', error);
    req.flash('error', 'An error occurred while saving the Dispute.');
    res.redirect('/hr/dispute/create');
  }


};

exports.renderDisputeCreatePage = async (req, res) => {
  try {
    const staffList = await StaffDetails.findAll(); // fetch staff list
    // console.log("staffList",staffList)
    const messages = req.flash();
    res.render('hr/dispute/create', { staffList, messages, });  // views\hr\dispute\create.ejs
  } catch (err) {
    console.error(err);
    res.render('hr/dispute/create', {
      staffList: [],
        messages: { error: 'Failed to load staff list' },
      // errorMessage: 'Failed to load staff list',
    });
  }
};

// const getKpiDetails = async (kpiId) => {
//   const kpiData = await kpi.findOne({ where: { id: kpiId } });
//   if (kpiData) {
//     return kpiData.get();  // This converts the Sequelize instance to a plain object
//   }
//   return null;
// };

const getDisputeDetails = async (disputeId) => {
  const disputeData = await DisputeManagement.findOne({
    where: { id: disputeId },
    include: [{
      model: StaffDetails, 
      as: 'StaffDetail',  // Assuming the name of the staff model is `staffDetails`
      attributes: ['staff_name', 'staff_id', 'ccdetails'], // Specify the columns you want
    }],
  });

  if (disputeData) {
    // Get the raw object data
    const data = disputeData.get({ plain: true });

    // Format kpi_date to 'YYYY-MM-DD' if it's a Date object or ISO string
    if (data.doi) {
      data.doi = new Date(data.doi).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.addressed_date) {
      data.addressed_date = new Date(data.addressed_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
    if (data.response_date) {
      data.response_date = new Date(data.response_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }

    return data;
  }
  return null;
};

exports.disputeEdit = async (req, res) => {
  const { id } = req.params;
  try {
    const dispute = await getDisputeDetails(id);
    console.log('dispute >> ', dispute)
    if (!dispute) {
      req.flash('error', 'Dispute not found');
      return res.render('hr/dispute/edit_dispute', {
        dispute,
        errorMessages: req.flash('error'),
        successMessages: []
      });
      // return res.status(404).render('error', { message: 'KPI not found' });
    }

    // req.flash('success', 'KPI not found');
    return res.render('hr/dispute/edit_dispute', {
      dispute,
      errorMessages: [],
      successMessages: []
    });
    // res.render('hr/kpi/editKpi', { kpi, messages: req.flash() });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal Server Error');
    return res.render('hr/dispute/edit_dispute', {
      dispute,
      errorMessages: req.flash('error'),
      successMessages: []
    });
    // res.status(500).render('error', { message: 'Internal Server Error' });
  }
  // res.render('hr/kpi/editKpi', { messages: req.flash() });
};

exports.disputeUpdate = async (req, res) => {

  const { id } = req.params;
  const { ...fieldsToUpdate } = req.body;

  const beforeUpdateDispute = await getDisputeDetails(id);

  if (!id) {
    req.flash('error', 'ID is required for updating details.');
    return res.render('hr/dispute/edit_dispute', {
      dispute: beforeUpdateDispute,
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
    return res.render('hr/dispute/edit_dispute', {
      dispute: beforeUpdateDispute,
      errorMessages: req.flash('error'),
      successMessages: []
    });
    // return res.render('hr/kpi/editKpi', { errorMessages: 'No data provided for update.', staff: beforeUpdateKpi });
  }

  try {
    // console.log('dataToUpdate >>>', dataToUpdate)
    const [updatedDispute] = await DisputeManagement.update(dataToUpdate, {
      where: { id }
    });

    if (updatedDispute[0] === 0) {
      req.flash('error', 'No Dsipute record found with the given ID.');
      return res.render('hr/dispute/edit_dispute', {
        dispute: beforeUpdateDispute,
        errorMessages: req.flash('error'),
        successMessages: []
      });
      // return res.render('hr/kpi/editKpi', { errorMessages: 'No kpi record found with the given ID.', staff: beforeUpdateKpi });
    }

    const disputeDetails = await getDisputeDetails(id);

    req.flash('success', 'Dispute details updated successfully!');
    return res.render('hr/dispute/edit_dispute', {
      dispute: disputeDetails,
      successMessages: req.flash('success'),
      errorMessages: []
    });

  } catch (err) {
    console.error('Error during dispute update:', err);
    req.flash('error', 'Error updating dispute details.');
    return res.render('hr/dispute/edit_dispute', {
      dispute: beforeUpdateDispute,
      errorMessages: req.flash('error'),
      successMessages: []
    });
    // req.flash('error', 'Error updating kpi details.');
    // return res.render('hr/kpi/editKpi', { kpi: beforeUpdateKpi, errorMessages: req.flash('error') });

    // return res.render('hr/kpi/editKpi', { errorMessage: 'Error updating kpi details.', staff: beforeUpdateKpi });
  }

};





