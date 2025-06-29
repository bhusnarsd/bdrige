module.exports = (sequelize, DataTypes) => {
    const EndService = sequelize.define('EndService', {
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
        dept: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        job_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        procd_norsafrl_date: {
            type: DataTypes.DATE
        },
        procd_norsafrl_status: {
            type: DataTypes.STRING,
        },
        procd_aorharot_date: {
            type: DataTypes.DATE,
        },
        procd_aorharot_status: {
            type: DataTypes.STRING,
        },
        procd_eisacaeiwh_date: {
            type: DataTypes.DATE,
        },
        procd_eisacaeiwh_status: {
            type: DataTypes.STRING,
        },
        procd_hodcadh_date: {
            type: DataTypes.DATE,
        },
        procd_hodcadh_status: {
            type: DataTypes.STRING,
        },
        procd_rocp_date: {
            type: DataTypes.DATE,
        },
        procd_rocp_status: {
            type: DataTypes.STRING,
        },
        procd_ids_date: {
            type: DataTypes.DATE,
        },
        procd_ids_status: {
            type: DataTypes.STRING,
        },
        procd_fc_date: {
            type: DataTypes.DATE,
        },
        procd_fc_status: {
            type: DataTypes.STRING,
        },
        procd_keys_date: {
            type: DataTypes.DATE,
        },
        procd_keys_status: {
            type: DataTypes.STRING,
        },
        procd_tr_date: {
            type: DataTypes.DATE,
        },
        procd_tr_status: {
            type: DataTypes.STRING,
        },
        procd_soata_date: {
            type: DataTypes.DATE,
        },
        procd_soata_status: {
            type: DataTypes.STRING,
        },
        procd_op_date: {
            type: DataTypes.DATE,
        },
        procd_op_status: {
            type: DataTypes.STRING,
        },
        procd_sal_date: {
            type: DataTypes.DATE,
        },
        procd_sal_status: {
            type: DataTypes.STRING,
        },
        procd_gt_date: {
            type: DataTypes.DATE,
        },
        procd_gt_status: {
            type: DataTypes.STRING,
        },
        procd_ul_date: {
            type: DataTypes.DATE,
        },
        procd_ul_status: {
            type: DataTypes.STRING,
        },
        procd_cfoacacf_date: {
            type: DataTypes.DATE,
        },
        procd_cfoacacf_status: {
            type: DataTypes.STRING,
        },
        procd_eosbchce_date: {
            type: DataTypes.DATE,
        },
        procd_eosbchce_status: {
            type: DataTypes.STRING,
        },
        procd_colcctlc_date: {
            type: DataTypes.DATE,
        },
        procd_colcctlc_status: {
            type: DataTypes.STRING,
        },
        procd_fsprfsp_date: {
            type: DataTypes.DATE,
        },
        procd_fsprfsp_status: {
            type: DataTypes.STRING,
        },
        procd_rchiael_date: {
            type: DataTypes.DATE,
        },
        procd_rchiael_status: {
            type: DataTypes.STRING,
        },
        procd_fafupfot_date: {
            type: DataTypes.DATE,
        },
        procd_fafupfot_status: {
            type: DataTypes.STRING,
        },
        recit_wiyprfltc: {
            type: DataTypes.STRING,
        },
        recit_hswywyjr: {
            type: DataTypes.STRING,
        },
        recit_wdyemayj: {
            type: DataTypes.STRING,
        },
        recit_wdyelayj: {
            type: DataTypes.STRING,
        },
        recit_wysaauttfp: {
            type: DataTypes.STRING,
        },
        recit_dyrasartdyje: {
            type: DataTypes.STRING,
        },
        recit_hwydtweacatc: {
            type: DataTypes.STRING,
        },
        recit_dyfvaaaae: {
            type: DataTypes.STRING,
        },
        recit_wtofpgad: {
            type: DataTypes.STRING,
        },
        recit_hewtcwydaatc: {
            type: DataTypes.STRING,
        },
        recit_wyswtlorafyr: {
            type: DataTypes.STRING,
        },
        recit_hwydtweacatce: {
            type: DataTypes.STRING,
        },
        recit_wycrtcitfwown: {
            type: DataTypes.STRING,
        },
        recit_dyhasfitw: {
            type: DataTypes.STRING,
        },
        recit_itaeywltsayewtc: {
            type: DataTypes.STRING,
        },
        
    }, {
        tableName: 'end_service',
    });

    // Define the association: EndService belongs to StaffDetails
    EndService.associate = function (models) {
        // ✅ Correct: models.StaffDetails matches index.js
        EndService.belongsTo(models.StaffDetails, {
          foreignKey: 'staff_id',
          targetKey: 'staff_id',
          as: 'StaffDetail',     // optional alias for eager loading
          onDelete: 'CASCADE',
        });
      };
      

    return EndService;
};
