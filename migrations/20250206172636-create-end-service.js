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
    await queryInterface.createTable('end_service', {
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
          key: 'id',
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
      procd_norsafrl_date: {
        type: Sequelize.DATE,
      },
      procd_norsafrl_status: {
        type: Sequelize.STRING,
      },
      procd_aorharot_date: {
        type: Sequelize.DATE,
      },
      procd_aorharot_status: {
        type: Sequelize.STRING,
      },
      procd_eisacaeiwh_date: {
        type: Sequelize.DATE,
      },
      procd_eisacaeiwh_status: {
        type: Sequelize.STRING,
      },
      procd_hodcadh_date: {
        type: Sequelize.DATE,
      },
      procd_hodcadh_status: {
        type: Sequelize.STRING,
      },
      procd_rocp_date: {
        type: Sequelize.DATE,
      },
      procd_rocp_status: {
        type: Sequelize.STRING,
      },
      procd_ids_date: {
        type: Sequelize.DATE,
      },
      procd_ids_status: {
        type: Sequelize.STRING,
      },
      procd_fc_date: {
        type: Sequelize.DATE,
      },
      procd_fc_status: {
        type: Sequelize.STRING,
      },
      procd_keys_date: {
        type: Sequelize.DATE,
      },
      procd_keys_status: {
        type: Sequelize.STRING,
      },
      procd_tr_date: {
        type: Sequelize.DATE,
      },
      procd_tr_status: {
        type: Sequelize.STRING,
      },
      procd_soata_date: {
        type: Sequelize.DATE,
      },
      procd_soata_status: {
        type: Sequelize.STRING,
      },
      procd_op_date: {
        type: Sequelize.DATE,
      },
      procd_op_status: {
        type: Sequelize.STRING,
      },
      procd_sal_date: {
        type: Sequelize.DATE,
      },
      procd_sal_status: {
        type: Sequelize.STRING,
      },
      procd_gt_date: {
        type: Sequelize.DATE,
      },
      procd_gt_status: {
        type: Sequelize.STRING,
      },
      procd_ul_date: {
        type: Sequelize.DATE,
      },
      procd_ul_status: {
        type: Sequelize.STRING,
      },
      procd_cfoacacf_date: {
        type: Sequelize.DATE,
      },
      procd_cfoacacf_status: {
        type: Sequelize.STRING,
      },
      procd_eosbchce_date: {
        type: Sequelize.DATE,
      },
      procd_eosbchce_status: {
        type: Sequelize.STRING,
      },
      procd_colcctlc_date: {
        type: Sequelize.DATE,
      },
      procd_colcctlc_status: {
        type: Sequelize.STRING,
      },
      procd_fsprfsp_date: {
        type: Sequelize.DATE,
      },
      procd_fsprfsp_status: {
        type: Sequelize.STRING,
      },
      procd_rchiael_date: {
        type: Sequelize.DATE,
      },
      procd_rchiael_status: {
        type: Sequelize.STRING,
      },
      procd_fafupfot_date: {
        type: Sequelize.DATE,
      },
      procd_fafupfot_status: {
        type: Sequelize.STRING,
      },
      recit_wiyprfltc: {
        type: Sequelize.STRING,
      },
      recit_hswywyjr: {
        type: Sequelize.STRING,
      },
      recit_wdyemayj: {
        type: Sequelize.STRING,
      },
      recit_wdyelayj: {
        type: Sequelize.STRING,
      },
      recit_wysaauttfp: {
        type: Sequelize.STRING,
      },
      recit_dyrasartdyje: {
        type: Sequelize.STRING,
      },
      recit_hwydtweacatc: {
        type: Sequelize.STRING,
      },
      recit_dyfvaaaae: {
        type: Sequelize.STRING,
      },
      recit_wtofpgad: {
        type: Sequelize.STRING,
      },
      recit_hewtcwydaatc: {
        type: Sequelize.STRING,
      },
      recit_wyswtlorafyr: {
        type: Sequelize.STRING,
      },
      recit_hwydtweacatce: {
        type: Sequelize.STRING,
      },
      recit_wycrtcitfwown: {
        type: Sequelize.STRING,
      },
      recit_dyhasfitw: {
        type: Sequelize.STRING,
      },
      recit_itaeywltsayewtc: {
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
    await queryInterface.dropTable('end_service');
  }
};
