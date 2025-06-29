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
    await queryInterface.createTable('induction_program', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      staff_id: {
        type: Sequelize.VARCHAR(20),
        references: {
          model: 'staff_details', // Table name
          key: 'staff_id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      dept: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      job_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      df_status: {
        type: Sequelize.STRING,
      },
      itc_status: {
        type: Sequelize.STRING,
      },
      neoj_status: {
        type: Sequelize.STRING,
      },
      sup_status: {
        type: Sequelize.STRING,
      },
      gleae_status: {
        type: Sequelize.STRING,
      },
      iohow_status: {
        type: Sequelize.STRING,
      },
      trfpeiam_status: {
        type: Sequelize.STRING,
      },
      jd_status: {
        type: Sequelize.STRING,
      },
      ppoe_status: {
        type: Sequelize.STRING,
      },
      btcnaof_status: {
        type: Sequelize.STRING,
      },
      riwsiwol_status: {
        type: Sequelize.STRING,
      },
      afrlalslel_status: {
        type: Sequelize.STRING,
      },
      uauppcrditc_status: {
        type: Sequelize.STRING,
      },
      dcglosapcp_status: {
        type: Sequelize.STRING,
      },
      dwtpc_status: {
        type: Sequelize.STRING,
      },
      mrpomrad_status: {
        type: Sequelize.STRING,
      },
      hasirttd_status: {
        type: Sequelize.STRING,
      },
      iofiap_status: {
        type: Sequelize.STRING,
      },
      loffe_status: {
        type: Sequelize.STRING,
      },
      apicof_status: {
        type: Sequelize.STRING,
      },
      air_status: {
        type: Sequelize.STRING,
      },
      faf_status: {
        type: Sequelize.STRING,
      },
      lopi_status: {
        type: Sequelize.STRING,
      },
      cowatm_status: {
        type: Sequelize.STRING,
      },
      afkibfcme_status: {
        type: Sequelize.STRING,
      },
      wm_status: {
        type: Sequelize.STRING,
      },
      vaab_status: {
        type: Sequelize.STRING,
      },
      ic_status: {
        type: Sequelize.STRING,
      },
      mipaatt_status: {
        type: Sequelize.STRING,
      },
      pp_status: {
        type: Sequelize.STRING,
      },
      dp_status: {
        type: Sequelize.STRING,
      },
      cttcatp_status: {
        type: Sequelize.STRING,
      },
      con_status: {
        type: Sequelize.STRING,
      },
      nc_status: {
        type: Sequelize.STRING,
      },
      aog_status: {
        type: Sequelize.STRING,
      },
      lrrs_status: {
        type: Sequelize.STRING,
      },
      puot_status: {
        type: Sequelize.STRING,
      },
      sobc_status: {
        type: Sequelize.STRING,
      },
      pan_status: {
        type: Sequelize.STRING,
      },
      wash_status: {
        type: Sequelize.STRING,
      },
      moapo_status: {
        type: Sequelize.STRING,
      },
      ears_status: {
        type: Sequelize.STRING,
      },
      cpapacoe_status: {
        type: Sequelize.STRING,
      },
      super_status: {
        type: Sequelize.STRING,
      },
      cam_status: {
        type: Sequelize.STRING,
      },
      isegnbce_status: {
        type: Sequelize.STRING,
      },
      hc_status: {
        type: Sequelize.STRING,
      },
      pcb_status: {
        type: Sequelize.STRING,
      },
      pay_status: {
        type: Sequelize.STRING,
      },
      emp_sign: {
        type: Sequelize.STRING,
      },
      emp_sign_date: {
        type: Sequelize.DATE,
      },
      hr_clinic_sign: {
        type: Sequelize.STRING,
      },
      hr_clinic_sign_date: {
        type: Sequelize.DATE,
      },
      sid_txt1: {
        type: Sequelize.STRING,
      },
      sid_txt2: {
        type: Sequelize.STRING,
      },
      sid_txt3: {
        type: Sequelize.STRING,
      },
      sid_fparty_sign: {
        type: Sequelize.STRING,
      },
      sid_fparty_name: {
        type: Sequelize.STRING,
      },
      sid_fparty_position: {
        type: Sequelize.STRING,
      },
      sid_sparty_name: {
        type: Sequelize.STRING,
      },
      sid_sparty_passport: {
        type: Sequelize.STRING,
      },
      sid_sparty_address: {
        type: Sequelize.STRING,
      },
      sid_sparty_date: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('induction_program');
  }
};
