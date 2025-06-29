'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staff_details', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      staff_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      staff_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      staff_email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      staff_phone: Sequelize.STRING(15),
      dob: Sequelize.DATEONLY,
      econtact: Sequelize.STRING(15),
      bank_acc: Sequelize.TEXT,
      permanent_address: Sequelize.TEXT,
      temporary_address: Sequelize.TEXT,
      ccdetails: Sequelize.STRING(15),
      references: Sequelize.TEXT,
      twrips_datetype: Sequelize.DATEONLY,
      twrips: Sequelize.BOOLEAN,
      itcpd: Sequelize.TEXT,
      itcpd_status: Sequelize.TEXT,
      passport_file: Sequelize.STRING(70),
      passport_expiry: Sequelize.DATEONLY,
      passport: Sequelize.BOOLEAN,
      visa_file: Sequelize.STRING(70),
      visa_expiry: Sequelize.DATEONLY,
      visa: Sequelize.BOOLEAN,
      exp_letter_file: Sequelize.STRING(70),
      exp_letter_date: Sequelize.DATEONLY,
      experience: Sequelize.BOOLEAN,
      license_file: Sequelize.STRING(70),
      license_expiry: Sequelize.DATEONLY,
      license: Sequelize.BOOLEAN,
      emirates_id_file: Sequelize.STRING(70),
      emirates_id_expiry: Sequelize.DATEONLY,
      emirates_id: Sequelize.BOOLEAN,
      hepatitis_b_file: Sequelize.STRING(70),
      hepatitis_b_expiry: Sequelize.DATEONLY,
      hepatitis_b: Sequelize.BOOLEAN,
      bls_file: Sequelize.STRING(70),
      bls_file_date: Sequelize.DATEONLY,
      bls: Sequelize.BOOLEAN,
      hdc_file: Sequelize.STRING(70),
      hdc_file_date: Sequelize.DATEONLY,
      hdc: Sequelize.BOOLEAN,
      dhacda_license_file: Sequelize.STRING(70),
      dhacda_license_expiry: Sequelize.DATEONLY,
      dhacda_license: Sequelize.BOOLEAN,
      employment_contract_file: Sequelize.STRING(70),
      employment_contract_expiry: Sequelize.DATEONLY,
      employment_contract: Sequelize.BOOLEAN,
      confidentiality_contract_file: Sequelize.STRING(70),
      confidentiality_contract_expiry: Sequelize.DATEONLY,
      confidentiality_contract: Sequelize.BOOLEAN,
      employee_handbook_file: Sequelize.STRING(70),
      employee_handbook_expiry: Sequelize.DATEONLY,
      employee_handbook: Sequelize.BOOLEAN,
      dhacda_policies_file: Sequelize.STRING(70),
      dhacda_policies_expiry: Sequelize.DATEONLY,
      dhacda_policies: Sequelize.BOOLEAN,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('staff_details');
  }
};
