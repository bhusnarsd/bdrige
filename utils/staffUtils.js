const { StaffDetails, Department, StaffConfidentialityContract } = require('../models');
const { Sequelize, Op } = require('sequelize');
const moment = require('moment-timezone');

// const getWarningList = async (modal, searchTerm, page = 1, limit = 10) => {
//     const offset = (page - 1) * limit;

//     // Define the `whereCondition` for filtering by `staff_id` or `staff_name`
//     const whereCondition = searchTerm
//         ? {
//             [Op.or]: [
//                 { '$StaffDetail.staff_id$': { [Op.iLike]: `%${searchTerm}%` } },  // Use alias "StaffDetail"
//                 { '$StaffDetail.staff_name$': { [Op.iLike]: `%${searchTerm}%` } }  // Use alias "StaffDetail"
//             ]
//         }
//         : {};  // No filter if searchTerm is empty

//     const { rows, count } = await modal.findAndCountAll({
//         include: [{
//             model: staffDetails,
//             required: true,  // INNER JOIN between StaffWarning and StaffDetails
//             as: 'StaffDetail', // Define the alias for the include
//             attributes: ['id', 'staff_name', 'staff_id'],
//         },
//         {
//             model: department, // Include the Department model
//             required: false, // OPTIONAL JOIN (change this to `true` if you want to ensure every row has a department)
//             as: 'Department', // Define the alias for the include
//             attributes: ['name'], // Include only the department name field
//         },
//         ],
//         where: whereCondition,
//         limit,
//         offset,
//     });

//     // Map through rows to ensure each row has access to both modal and staffDetails data
//     // const results = rows.map(row => ({
//     //     ...row.toJSON(),  // Include modal details
//     //     staffDetails: row.StaffDetail ? row.StaffDetail : null,  // Include associated StaffDetail
//     // }));

//     const results = rows.map(row => {
//         const data = row.toJSON(); // Include modal details
//         // Convert `doi` from UTC to Dubai time if it exists
//         if (data.doi) {
//             data.doi = moment.utc(data.doi).tz('Asia/Dubai').format('YYYY-MM-DD');
//         }
//         // Include associated StaffDetail
//         data.staffDetails = row.StaffDetail ? row.StaffDetail : null;
//         return data;
//     });

//     // console.log('results >>>>> ....', JSON.stringify(results))

//     return { rows: results, totalCount: count };
// };



const getWarningList = async (modal, searchTerm, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const whereCondition = searchTerm
    ? {
        [Op.or]: [
          { '$StaffDetail.staff_id$': { [Op.iLike]: `%${searchTerm}%` } },
          { '$StaffDetail.staff_name$': { [Op.iLike]: `%${searchTerm}%` } }
        ]
      }
    : {};

  const { rows, count } = await modal.findAndCountAll({
    include: [
      {
        model: StaffDetails,
        required: true,
        as: 'StaffDetail',
        attributes: ['staff_id', 'staff_name'],
        on: {
          // Match on string staff_id, not numeric id
          '$StaffWarning.staff_id$': { [Op.col]: 'StaffDetail.staff_id' }
        }
      },
      {
        model: Department,
        required: false,
        as: 'Department',
        attributes: ['name']
      }
    ],
    where: whereCondition,
    limit,
    offset,
  });

  const results = rows.map(row => {
    const data = row.toJSON();
    if (data.doi) {
      data.doi = moment.utc(data.doi).tz('Asia/Dubai').format('YYYY-MM-DD');
    }
    data.staffDetails = row.StaffDetail || null;
    return data;
  });

  return { rows: results, totalCount: count };
};

// const getListWithStaffDetails = async (modal, searchTerm, page = 1, limit = 10) => {
//     const offset = (page - 1) * limit;

//     // Define the `whereCondition` for filtering by `staff_id` or `staff_name`
//     const whereCondition = searchTerm
//         ? {
//             [Op.or]: [
//                 { '$StaffDetail.staff_id$': { [Op.iLike]: `%${searchTerm}%` } },  // Use alias "StaffDetail"
//                 { '$StaffDetail.staff_name$': { [Op.iLike]: `%${searchTerm}%` } }  // Use alias "StaffDetail"
//             ]
//         }
//         : {};  // No filter if searchTerm is empty

//     const { rows, count } = await modal.findAndCountAll({
//         include: {
//             model: staffDetails,
//             required: true,  // INNER JOIN between StaffWarning and StaffDetails
//             as: 'StaffDetail', // Define the alias for the include
//             attributes: ['id', 'staff_name', 'staff_id'],
//         },
//         where: whereCondition,
//         limit,
//         offset,
//     });

//     // Map through rows to ensure each row has access to both modal and staffDetails data
//     // const results = rows.map(row => ({
//     //     ...row.toJSON(),  // Include modal details
//     //     staffDetails: row.StaffDetail ? row.StaffDetail : null,  // Include associated StaffDetail
//     // }));

//     const results = rows.map(row => {
//         const data = row.toJSON(); // Include modal details
//         // Convert `doi` from UTC to Dubai time if it exists
//         if (data.doi) {
//             data.doi = moment.utc(data.doi).tz('Asia/Dubai').format('YYYY-MM-DD');
//         }
//         // Include associated StaffDetail
//         data.staffDetails = row.StaffDetail ? row.StaffDetail : null;
//         return data;
//     });

//     // console.log('results >>>>> ....', JSON.stringify(results))

//     return { rows: results, totalCount: count };
// };

const getListWithStaffDetails = async (kpiModel, searchTerm, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
  
    const whereCondition = searchTerm
      ? {
        Department: { [Sequelize.Op.iLike]: `%${searchTerm}%` }
        }
      : {};
  
      const { count, rows } = await kpiModel.findAndCountAll({
        where: whereCondition,
        include: [{
          model: StaffDetails,
          as: 'StaffDetail',  // must match association alias
          required: false
        }],
        limit,
        offset
      });
    // const { count, rows } = await kpiModel.findAndCountAll({
    //   where: whereCondition,
    //   include: [{
    //     model: require('../models').staffDetails,
    //     required: true,
    //     on: Sequelize.literal(`"kpi"."staff_id" = CAST("StaffDetail"."id" AS VARCHAR)`)
    //   }],
    //   limit,
    //   offset
    // });
  
    return { rows, totalCount: count };
  };
const getDisputeList = async (modal, searchTerm, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    // Define the `whereCondition` for filtering by `staff_id` or `staff_name`
    const whereCondition = searchTerm
        ? {
            [Op.or]: [
                { '$StaffDetail.staff_id$': { [Op.iLike]: `%${searchTerm}%` } },  // Use alias "StaffDetail"
                { '$StaffDetail.staff_name$': { [Op.iLike]: `%${searchTerm}%` } }  // Use alias "StaffDetail"
            ]
        }
        : {};  // No filter if searchTerm is empty

    const { rows, count } = await modal.findAndCountAll({
        include: {
            model: StaffDetails,
            required: true,  // INNER JOIN between StaffWarning and StaffDetails
            as: 'StaffDetail', // Define the alias for the include
            attributes: ['staff_name', 'staff_id'],
            on: {
              // Match on string staff_id, not numeric id
              '$DisputeManagement.staff_id$': { [Op.col]: 'StaffDetail.staff_id' }
            }
        },
        where: whereCondition,
        limit,
        offset,
    });

    // Map through rows to ensure each row has access to both modal and staffDetails data
    // const results = rows.map(row => ({
    //     ...row.toJSON(),  // Include modal details
    //     staffDetails: row.StaffDetail ? row.StaffDetail : null,  // Include associated StaffDetail
    // }));

    const results = rows.map(row => {
        const data = row.toJSON(); // Include modal details
        // Convert `doi` from UTC to Dubai time if it exists
        if (data.doi) {
            data.doi = moment.utc(data.doi).tz('Asia/Dubai').format('YYYY-MM-DD');
        }
        if (data.response_date) {
            data.response_date = moment.utc(data.response_date).tz('Asia/Dubai').format('YYYY-MM-DD');
        }
        if (data.dob) {
            data.dob = moment.utc(data.dob).tz('Asia/Dubai').format('YYYY-MM-DD');
        }
        // Include associated StaffDetail
        data.staffDetails = row.StaffDetail ? row.StaffDetail : null;
        return data;
    });

    // console.log('results >>>>> ....', JSON.stringify(results))

    return { rows: results, totalCount: count };
};

const getEndServiceList = async (EndServiceModel, searchTerm, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const whereCondition = searchTerm
        ? {
            [Op.or]: [
                { '$StaffDetail.staff_id$': { [Op.iLike]: `%${searchTerm}%` } },
                { '$StaffDetail.staff_name$': { [Op.iLike]: `%${searchTerm}%` } }
            ]
        }
        : {};

    const { rows, count } = await EndServiceModel.findAndCountAll({
        where: whereCondition,
        include: [{
            model: StaffDetails,
            as: 'StaffDetail', // Make sure this alias matches your association
            required: true,
            attributes: ['staff_id', 'staff_name'],
            on: {
                '$EndService.staff_id$': { [Op.col]: 'StaffDetail.staff_id' } // Use correct table alias
            }
        }],
        limit,
        offset,
    });

    // Format result dates
    const results = rows.map(row => {
        const data = row.toJSON();

        // Example date formatting
        if (data.createdAt) {
            data.createdAt = moment.utc(data.createdAt).tz('Asia/Dubai').format('YYYY-MM-DD');
        }
        if (data.updatedAt) {
            data.updatedAt = moment.utc(data.updatedAt).tz('Asia/Dubai').format('YYYY-MM-DD');
        }

        data.staffDetails = row.StaffDetail || null;

        return data;
    });

    return { rows: results, totalCount: count };
};

const getInductionProgramList = async (InductionProgram, searchTerm, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const whereCondition = searchTerm
    ? {
        [Op.or]: [
          { '$StaffDetail.staff_id$': { [Op.iLike]: `%${searchTerm}%` } },
          { '$StaffDetail.staff_name$': { [Op.iLike]: `%${searchTerm}%` } }
        ]
      }
    : {};

  const { rows, count } = await InductionProgram.findAndCountAll({
    where: whereCondition,
    include: [{
      model: StaffDetails,
      as: 'StaffDetail',
      required: true,
      attributes: ['staff_id', 'staff_name'],
      // 🔴 Removed the `on` clause to avoid error
    }],
    limit,
    offset
  });

  const results = rows.map(row => {
    const data = row.toJSON();
    if (data.date) {
      data.date = moment.utc(data.date).tz('Asia/Dubai').format('YYYY-MM-DD');
    }
    data.staffDetails = row.StaffDetail || null;
    return data;
  });

  return { rows: results, totalCount: count };
};


const getHandBookList = async (HandBookModel, searchTerm, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const whereCondition = searchTerm
    ? {
        [Op.or]: [
          { '$StaffDetail.staff_id$': { [Op.iLike]: `%${searchTerm}%` } },
          { '$StaffDetail.staff_name$': { [Op.iLike]: `%${searchTerm}%` } }
        ]
      }
    : {};

  const { rows, count } = await HandBookModel.findAndCountAll({
    where: whereCondition,
    include: [{
      model: StaffDetails,
      as: 'StaffDetail',
      required: true,
      attributes: ['staff_id', 'staff_name']
    }],
    limit,
    offset
  });

  const results = rows.map(row => {
    const data = row.toJSON();

    // Optional: Format date fields
    if (data.createdAt) {
      data.createdAt = moment.utc(data.createdAt).tz('Asia/Dubai').format('YYYY-MM-DD');
    }

    data.staffDetails = row.StaffDetail || null;
    return data;
  });

  return { rows: results, totalCount: count };
};

// const getStaffConfidentialityContractList = async (StaffConfidentialityContractModel, searchTerm, page = 1, limit = 10) => {
//   const offset = (page - 1) * limit;

//   const whereCondition = searchTerm
//     ? {
//         [Op.or]: [
//           { '$StaffDetail.staff_id$': { [Op.iLike]: `%${searchTerm}%` } },
//           { '$StaffDetail.staff_name$': { [Op.iLike]: `%${searchTerm}%` } }
//         ]
//       }
//     : {};

//   const { rows, count } = await StaffConfidentialityContractModel.findAndCountAll({
//     where: whereCondition,
//     include: [{
//       model: staffDetails,
//       as: 'StaffDetail',  // ensure association is correctly defined with this alias
//       required: true,
//       attributes: ['staff_id', 'staff_name']
//     }],
//     limit,
//     offset
//   });

//   const results = rows.map(row => {
//     const data = row.toJSON();

//     // Optional: Format any date fields if present
//     if (data.createdAt) {
//       data.createdAt = moment.utc(data.createdAt).tz('Asia/Dubai').format('YYYY-MM-DD');
//     }

//     data.staffDetails = row.StaffDetail || null;
//     return data;
//   });

//   return { rows: results, totalCount: count };
// };

// const getStaffConfidentialityContractList = async (searchTerm, page = 1, limit = 10) => {
//   const offset = (page - 1) * limit;

//   const whereCondition = searchTerm
//     ? {
//         [Op.or]: [
//           { '$StaffDetail.staff_id$': { [Op.iLike]: `%${searchTerm}%` } },
//           { '$StaffDetail.staff_name$': { [Op.iLike]: `%${searchTerm}%` } }
//         ]
//       }
//     : {};

//   const { rows, count } = await staffConfidentialityContract.findAndCountAll({
//     where: whereCondition,
//     include: [{
//       model: staffDetails,
//       as: 'StaffDetail',
//       required: true,
//       attributes: ['staff_id', 'staff_name']
//     }],
//     limit,
//     offset
//   });

//   const results = rows.map(row => {
//     const data = row.toJSON();
//     if (data.createdAt) {
//       data.createdAt = moment.utc(data.createdAt).tz('Asia/Dubai').format('YYYY-MM-DD');
//     }
//     data.staffDetails = row.StaffDetail || null;
//     return data;
//   });

//   return { rows: results, totalCount: count };
// };
const getStaffConfidentialityContractList = async (searchTerm, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const whereCondition = searchTerm
    ? {
        [Op.or]: [
          { '$StaffDetail.staff_id$': { [Op.iLike]: `%${searchTerm}%` } },
          { '$StaffDetail.staff_name$': { [Op.iLike]: `%${searchTerm}%` } }
        ]
      }
    : {};

  const { rows, count } = await StaffConfidentialityContract.findAndCountAll({
    where: whereCondition,
    include: [{
      model: StaffDetails,
      as: 'StaffDetail',
      required: true,
      attributes: ['staff_id', 'staff_name']
    }],
    limit,
    offset
  });

  const results = rows.map(row => {
    const data = row.toJSON();
    if (data.createdAt) {
      data.createdAt = moment.utc(data.createdAt).tz('Asia/Dubai').format('YYYY-MM-DD');
    }
    data.staffDetails = row.StaffDetail || null;
    return data;
  });

  return { rows: results, totalCount: count };
};


module.exports = { getWarningList, getDisputeList, getListWithStaffDetails, getEndServiceList, getInductionProgramList, getHandBookList, getStaffConfidentialityContractList };