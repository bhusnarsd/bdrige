module.exports = (sequelize, DataTypes) => {
    const HandBook = sequelize.define('HandBook', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Automatically created as a unique primary key
            autoIncrement: true, // This will auto-increment for each new row
        },
        staff_id: {
            type: DataTypes.STRING,
            references: {
                model: 'staff_details',
                key: 'staff_id', // <-- FIXED
            }
        },
        passport: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cphone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dob: {
            type: DataTypes.DATE
        },
        econtact: {
            type: DataTypes.STRING,
        },
        paddress: {
            type: DataTypes.STRING,
        },
        taddress: {
            type: DataTypes.STRING,
        },
        references: {
            type: DataTypes.STRING,
        },
        probation_txt: {
            type: DataTypes.STRING,
        },
        how1: {
            type: DataTypes.STRING,
        },
        how2: {
            type: DataTypes.STRING,
        },
        fpunique_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fpemp_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fpposition: {
            type: DataTypes.STRING,
        },
        fpecontact: {
            type: DataTypes.STRING,
        },
        fpsign: {
            type: DataTypes.STRING,
        },
        spname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sppassport: {
            type: DataTypes.STRING,
            allowNull: false
        },
        spcaddress: {
            type: DataTypes.STRING,
        },
        spdate: {
            type: DataTypes.DATE,
        },
        spsign: {
            type: DataTypes.STRING,
        },
        
    }, {
        tableName: 'staff_handbook',
    });

    // Define the association: HandBook belongs to StaffDetails
    HandBook.associate = function (models) {
        HandBook.belongsTo(models.StaffDetails, {
            foreignKey: 'staff_id',
            targetKey: 'staff_id',
            onDelete: 'CASCADE',
          });
          
    };

    return HandBook;
};
