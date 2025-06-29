module.exports = (sequelize, DataTypes) => {

    const enquiry = sequelize.define('enquiry', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        staff_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        enquiryId: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        // staff_id: {
        //     type: DataTypes.STRING(10),
        //     allowNull: false,
        // },
        staff_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
        twrips_datetype: DataTypes.DATEONLY,
        twrips: DataTypes.BOOLEAN,
        itcpd: DataTypes.TEXT,
        itcpd_status: DataTypes.TEXT,
        passport_file: DataTypes.STRING(70),
        passport_expiry: DataTypes.DATEONLY,
        passport: DataTypes.BOOLEAN,
        visa_file: DataTypes.STRING(70),
        visa_expiry: DataTypes.DATEONLY,
        visa: DataTypes.BOOLEAN,
        exp_letter_file: DataTypes.STRING(70),
        exp_letter_date: DataTypes.DATEONLY,
        experience: DataTypes.BOOLEAN,
        license_file: DataTypes.STRING(70),
        license_expiry: DataTypes.DATEONLY,
        license: DataTypes.BOOLEAN,
        emirates_id_file: DataTypes.STRING(70),
        emirates_id_expiry: DataTypes.DATEONLY,
        emirates_id: DataTypes.BOOLEAN,
        hepatitis_b_file: DataTypes.STRING(70),
        hepatitis_b_expiry: DataTypes.DATEONLY,
        hepatitis_b: DataTypes.BOOLEAN,
        bls_file: DataTypes.STRING(70),
        bls_file_date: DataTypes.DATEONLY,
        bls: DataTypes.BOOLEAN,
        hdc_file: DataTypes.STRING(70),
        hdc_file_date: DataTypes.DATEONLY,
        hdc: DataTypes.BOOLEAN,
        dhacda_license_file: DataTypes.STRING(70),
        dhacda_license_expiry: DataTypes.DATEONLY,
        dhacda_license: DataTypes.BOOLEAN,
        employment_contract_file: DataTypes.STRING(70),
        employment_contract_expiry: DataTypes.DATEONLY,
        employment_contract: DataTypes.BOOLEAN,
        confidentiality_contract_file: DataTypes.STRING(70),
        confidentiality_contract_expiry: DataTypes.DATEONLY,
        confidentiality_contract: DataTypes.BOOLEAN,
        employee_handbook_file: DataTypes.STRING(70),
        employee_handbook_expiry: DataTypes.DATEONLY,
        employee_handbook: DataTypes.BOOLEAN,
        dhacda_policies_file: DataTypes.STRING(70),
        dhacda_policies_expiry: DataTypes.DATEONLY,
        dhacda_policies: DataTypes.BOOLEAN
    }, {
        tableName: 'staff_details',  // Explicitly specifying the table name 
        timestamps: true,    // Enable createdAt and updatedAt fields
    });

    // Define the association: StaffDetails has many StaffWarning
    StaffDetails.associate = function (models) {
        // Associate with staffWarning
        StaffDetails.hasMany(models.staffWarning, {
          foreignKey: 'staff_id',
          onDelete: 'CASCADE',
        });
      
        // Associate with kpi
        StaffDetails.hasMany(models.kpi, {
          foreignKey: 'staff_id',
          onDelete: 'CASCADE',
        });
      };

    return StaffDetails;
};
