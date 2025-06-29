module.exports = (sequelize, DataTypes) => {
    const StaffWarning = sequelize.define('StaffWarning', {
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
        department_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'mst_departments',
                key: 'id',
            },
        },
        issues_concerns: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        background_info: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ecotp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        action1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        action2: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        action3: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deadline_date: {
            type: DataTypes.DATE,
        },
        email_to_respond: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        appropriate_date: {
            type: DataTypes.DATE,
        },
        response: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        responded_by: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        conclusion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        any_document: {
            type: DataTypes.STRING,
        },
    }, {
        tableName: 'staff_warnings',
    });

    // Define the association: StaffWarning belongs to StaffDetails
    StaffWarning.associate = function (models) {
        StaffWarning.belongsTo(models.StaffDetails, {
            foreignKey: 'staff_id',
            targetKey: 'staff_id',
            as: 'StaffDetail'
          });
          
          StaffWarning.belongsTo(models.Department, {
            foreignKey: 'department_id',
            as: 'Department'
          });
          
      };
      
    return StaffWarning;
};
