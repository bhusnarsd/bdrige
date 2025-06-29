// const { Sequelize, DataTypes } = require('sequelize');
// const config = require('../config/config.js');
// const sequelize = new Sequelize(config.development);

// // Load each model
// const staffLoginDetails = require('./staffLoginDetails.js')(sequelize, DataTypes);
// const staffDetails = require('./staffDetails.js')(sequelize, DataTypes);
// const department = require('./department.js')(sequelize, DataTypes);
// const staffWarning = require('./staffWarning.js')(sequelize, DataTypes);
// const kpi = require('./kpi.js')(sequelize, DataTypes);
// const disputeManagement = require('./disputeManagement.js')(sequelize, DataTypes);
// const endService = require('./endService.js')(sequelize, DataTypes);
// const inductionProgram = require('./inductionProgram.js')(sequelize, DataTypes);
// const handBook = require('./handBook.js')(sequelize, DataTypes);
// const staffConfidentialityContract = require('./staffConfidentialityContract.js')(sequelize, DataTypes);

// // Establish model associations
// staffDetails.associate({ staffWarning, kpi, disputeManagement, endService, inductionProgram, handBook });
// staffWarning.associate({ staffDetails, Department: department });
// kpi.associate({ staffDetails });
// disputeManagement.associate({ staffDetails });
// endService.associate({ staffDetails });
// inductionProgram.associate({ staffDetails });
// handBook.associate({ staffDetails });
// staffConfidentialityContract.associate = function (models) {
//     if (models.staffWarning) {
//         staffConfidentialityContract.hasMany(models.staffWarning, {
//             foreignKey: 'staff_id',
//             onDelete: 'CASCADE',
//         });
//     }
//     Object.keys(db).forEach(modelName => {
//         if (db[modelName].associate) {
//           db[modelName].associate(db);
//         }
//       });
//     // if (models.kpi) {
//     //     staffConfidentialityContract.hasMany(models.kpi, {
//     //         foreignKey: 'staff_id',
//     //         onDelete: 'CASCADE',
//     //     });
//     // }
// };



// // Export models individually
// module.exports = {
//     sequelize,
//     staffLoginDetails,
//     staffDetails,
//     department,
//     staffWarning,
//     kpi,
//     disputeManagement,
//     endService,
//     inductionProgram,
//     handBook,
//     staffConfidentialityContract
// };

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js');
const sequelize = new Sequelize(config.development);

const db = {};

// Load models with consistent PascalCase naming
db.StaffLoginDetails = require('./staffLoginDetails.js')(sequelize, DataTypes);
db.StaffDetails = require('./staffDetails')(sequelize, DataTypes);
db.Department = require('./department')(sequelize, DataTypes);
db.StaffWarning = require('./staffWarning')(sequelize, DataTypes);
db.Kpi = require('./kpi')(sequelize, DataTypes);
db.DisputeManagement = require('./disputeManagement')(sequelize, DataTypes);
db.EndService = require('./endService')(sequelize, DataTypes);
db.InductionProgram = require('./inductionProgram')(sequelize, DataTypes);
db.HandBook = require('./handBook')(sequelize, DataTypes);
db.StaffConfidentialityContract = require('./staffConfidentialityContract')(sequelize, DataTypes);



// Add Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Set up model associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // Pass all models
  }
});

module.exports = db;
