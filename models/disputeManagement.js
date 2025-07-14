module.exports = (sequelize, DataTypes) => {
    const DisputeManagement = sequelize.define('DisputeManagement', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Automatically created as a unique primary key
            autoIncrement: true, // This will auto-increment for each new row
        },
        staff_id: {
            type: DataTypes.STRING,
            references: {
                model: 'staff_details', // Table name
                key: 'id',
            }
        },
        doi: {
            type: DataTypes.DATE,
        },
        concern: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email_to: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        addressed_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dept: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        response_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        responded_by: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        conclusion: {
            type: DataTypes.STRING,
        },
    }, {
        tableName: 'dispute_mgt',
    });

    DisputeManagement.associate = function (models) {
        // ✅ Correct: use models.StaffDetails exactly as registered
        DisputeManagement.belongsTo(models.StaffDetails, {
          foreignKey: 'staff_id',
          targetKey: 'staff_id',
          as: 'StaffDetail',     // optional alias for eager loading
          onDelete: 'CASCADE',
        });
      };
      
    return DisputeManagement;
};
