module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define('Department', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'mst_departments',
    });
  
    Department.associate = function(models) {
      // ✅ Correct: models.StaffWarning
      Department.hasMany(models.StaffWarning, {
        foreignKey: 'department_id',
        as: 'Warnings'
      });
    };
  
    return Department;
  };
  