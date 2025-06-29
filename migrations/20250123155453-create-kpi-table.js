'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kpi', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      staff_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'staff_details',
          key: 'staff_id',
        },
        onDelete: 'CASCADE',
      },
      kpi_date: Sequelize.DATE,
      department: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      e_period: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      kpi_text1: Sequelize.TEXT,
      kpi_text2: Sequelize.TEXT,
      kpi_text3: Sequelize.TEXT,
      kpi_text4: Sequelize.TEXT,
      kpi_text5: Sequelize.TEXT,

      rating_scale: Sequelize.STRING,

      trg1_art: Sequelize.TEXT,
      trg1_rwad: Sequelize.TEXT,
      trg1_rws: Sequelize.TEXT,
      trg1_mbc: Sequelize.TEXT,
      trg1_ppc: Sequelize.TEXT,
      trg1_sum: Sequelize.INTEGER,

      trg2_pos: Sequelize.TEXT,
      trg2_sft: Sequelize.TEXT,
      trg2_ccapc: Sequelize.TEXT,
      trg2_caos: Sequelize.TEXT,
      trg2_ps: Sequelize.TEXT,
      trg2_counslng: Sequelize.TEXT,
      trg2_sum: Sequelize.INTEGER,

      trg3_cs: Sequelize.TEXT,
      trg3_dm: Sequelize.TEXT,
      trg3_init: Sequelize.TEXT,
      trg3_cp: Sequelize.TEXT,
      trg3_gps: Sequelize.TEXT,
      trg3_tw: Sequelize.TEXT,
      trg3_sum: Sequelize.INTEGER,

      sasndtq1: Sequelize.TEXT,
      sasndtq2: Sequelize.TEXT,
      sasndtq3: Sequelize.TEXT,
      sasndtq4: Sequelize.TEXT,
      sasndtq5: Sequelize.TEXT,
      sasndtq6: Sequelize.TEXT,

      trg_total: Sequelize.INTEGER,
      ps_scale: Sequelize.STRING,

      staff_sign: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      hod_sign: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      hr_sign: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      director_sign: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      staff_sign1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      hod_sign1: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      pdf_path: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('kpi');
  }
};
