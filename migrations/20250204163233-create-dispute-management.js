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
    await queryInterface.createTable('dispute_mgt', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      staff_id: {
        type: Sequelize.VARCHAR(20),
        references: {
          model: 'staff_details',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      doi: {
        type: Sequelize.DATE,
      },
      concern: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email_to: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      addressed_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dept: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      response_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      responded_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      conclusion: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
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
    await queryInterface.dropTable('dispute_mgt');
  }
};
