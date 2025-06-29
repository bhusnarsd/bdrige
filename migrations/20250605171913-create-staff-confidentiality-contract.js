'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StaffConfidentialityContract', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      staff_id: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      staff_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      staff_phone: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      econtact: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      bank_acc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      permanent_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      temporary_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ccdetails: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      references: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      first_unique_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      first_employee_name: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      first_position: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      first_employee_econtact:{
        type: Sequelize.STRING(15),
      },
      second_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      second_passport_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      second_current_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      second_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StaffConfidentialityContract');
  }
};
