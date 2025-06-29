module.exports = (sequelize, DataTypes) => {
  const StaffLoginDetails = sequelize.define('StaffLoginDetails', {
    staff_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: 'staff_details',
        key: 'staff_id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    signatureImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'staff_login_details',
    timestamps: true,
  });

  StaffLoginDetails.associate = function (models) {
    StaffLoginDetails.belongsTo(models.StaffDetails, {
      foreignKey: 'staff_id',
      targetKey: 'staff_id',
      as: 'StaffDetail',
      onDelete: 'CASCADE',
    });
  };

  return StaffLoginDetails;
};
