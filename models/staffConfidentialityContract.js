module.exports = (sequelize, DataTypes) => {
  const StaffConfidentialityContract = sequelize.define('StaffConfidentialityContract', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    staff_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    staff_email: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true,
      validate: {
        isEmail: true,
      },
    },
    staff_phone: DataTypes.STRING(15),
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    econtact: DataTypes.STRING(15),
    bank_acc: DataTypes.TEXT,
    permanent_address: DataTypes.TEXT,
    temporary_address: DataTypes.TEXT,
    ccdetails: DataTypes.STRING(15),
    references: DataTypes.TEXT,

    // Flattened First Party Fields
    first_unique_id: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true,
    },
    first_employee_name: {
      type: DataTypes.STRING(20),
    },
    first_position: {
      type: DataTypes.STRING,
    },
    first_employee_econtact: {
      type: DataTypes.STRING(15)
    },

    // Flattened Second Party Fields
    second_name: {
      type: DataTypes.STRING,
    },
    second_passport_number: {
      type: DataTypes.STRING,
    },
    second_current_address: {
      type: DataTypes.STRING,
    },
    second_date: {
      type: DataTypes.DATEONLY,
    }

  }, {
    tableName: 'StaffConfidentialityContract',
    timestamps: true,
  });

  StaffConfidentialityContract.associate = function(models) {
    StaffConfidentialityContract.belongsTo(models.StaffDetails, {
      foreignKey: 'staff_id',
      targetKey: 'staff_id',
      as: 'StaffDetail'
    });
  };
  

  return StaffConfidentialityContract;
};
