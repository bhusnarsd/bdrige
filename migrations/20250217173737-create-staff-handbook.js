'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('staff_handbook', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      staff_id: {
        type: Sequelize.VARCHAR(20),
        references: {
          model: 'staff_details', // Referring to the staff_details table
          key: 'id',
        },
        onDelete: 'CASCADE', // Deleting the handbook when the staff record is deleted
      },
      passport: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cphone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dob: {
        type: Sequelize.DATE,
      },
      econtact: {
        type: Sequelize.STRING,
      },
      paddress: {
        type: Sequelize.STRING,
      },
      taddress: {
        type: Sequelize.STRING,
      },
      references: {
        type: Sequelize.STRING,
      },
      probation_txt: {
        type: Sequelize.STRING,
      },
      how1: {
        type: Sequelize.STRING,
      },
      how2: {
        type: Sequelize.STRING,
      },
      fpunique_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fpemp_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fpposition: {
        type: Sequelize.STRING,
      },
      fpecontact: {
        type: Sequelize.STRING,
      },
      fpsign: {
        type: Sequelize.STRING,
      },
      spname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sppassport: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      spcaddress: {
        type: Sequelize.STRING,
      },
      spdate: {
        type: Sequelize.DATE,
      },
      spsign: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('staff_handbook');
  }
};
