module.exports = (sequelize, DataTypes) => {
    const InductionProgram = sequelize.define('InductionProgram', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Automatically created as a unique primary key
            autoIncrement: true, // This will auto-increment for each new row
        },
        staff_id: {
            type: DataTypes.STRING,
            references: {
              model: 'staff_details',
              key: 'staff_id', // match the string key
            },
          },
        // staff_id: {
        //     type: DataTypes.STRING,
        //     references: {
        //         model: 'staff_details', // Table name
        //         key: 'id',
        //     }
        // },
        dept: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        job_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        df_status: {
            type: DataTypes.STRING
        },
        itc_status: {
            type: DataTypes.STRING,
        },
        neoj_status: {
            type: DataTypes.STRING,
        },
        sup_status: {
            type: DataTypes.STRING,
        },
        gleae_status: {
            type: DataTypes.STRING,
        },
        iohow_status: {
            type: DataTypes.STRING,
        },
        trfpeiam_status: {
            type: DataTypes.STRING,
        },
        jd_status: {
            type: DataTypes.STRING,
        },
        ppoe_status: {
            type: DataTypes.STRING,
        },
        btcnaof_status: {
            type: DataTypes.STRING,
        },
        riwsiwol_status: {
            type: DataTypes.STRING,
        },
        afrlalslel_status: {
            type: DataTypes.STRING,
        },
        uauppcrditc_status: {
            type: DataTypes.STRING,
        },
        dcglosapcp_status: {
            type: DataTypes.STRING,
        },
        dwtpc_status: {
            type: DataTypes.STRING,
        },
        mrpomrad_status: {
            type: DataTypes.STRING,
        },
        hasirttd_status: {
            type: DataTypes.STRING,
        },
        iofiap_status: {
            type: DataTypes.STRING,
        },
        loffe_status: {
            type: DataTypes.STRING,
        },
        apicof_status: {
            type: DataTypes.STRING,
        },
        air_status: {
            type: DataTypes.STRING,
        },
        faf_status: {
            type: DataTypes.STRING,
        },
        lopi_status: {
            type: DataTypes.STRING,
        },
        cowatm_status: {
            type: DataTypes.STRING,
        },
        afkibfcme_status: {
            type: DataTypes.STRING,
        },
        wm_status: {
            type: DataTypes.STRING,
        },
        vaab_status: {
            type: DataTypes.STRING,
        },
        ic_status: {
            type: DataTypes.STRING,
        },
        mipaatt_status: {
            type: DataTypes.STRING,
        },
        pp_status: {
            type: DataTypes.STRING,
        },
        dp_status: {
            type: DataTypes.STRING,
        },
        cttcatp_status: {
            type: DataTypes.STRING,
        },
        con_status: {
            type: DataTypes.STRING,
        },
        nc_status: {
            type: DataTypes.STRING,
        },
        aog_status: {
            type: DataTypes.STRING,
        },
        lrrs_status: {
            type: DataTypes.STRING,
        },
        puot_status: {
            type: DataTypes.STRING,
        },
        sobc_status: {
            type: DataTypes.STRING,
        },
        pan_status: {
            type: DataTypes.STRING,
        },
        wash_status: {
            type: DataTypes.STRING,
        },
        moapo_status: {
            type: DataTypes.STRING,
        },
        ears_status: {
            type: DataTypes.STRING,
        },
        cpapacoe_status: {
            type: DataTypes.STRING,
        },
        super_status: {
            type: DataTypes.STRING,
        },
        cam_status: {
            type: DataTypes.STRING,
        },
        isegnbce_status: {
            type: DataTypes.STRING,
        },
        hc_status: {
            type: DataTypes.STRING,
        },
        pcb_status: {
            type: DataTypes.STRING,
        },
        pay_status: {
            type: DataTypes.STRING,
        },
        emp_name: {
            type: DataTypes.STRING
        },
        emp_sign: {
            type: DataTypes.STRING,
        },
        emp_sign_date: {
            type: DataTypes.DATE,
        },
        hr_clinic_name: {
            type: DataTypes.STRING
        },
        hr_clinic_sign: {
            type: DataTypes.STRING,
        },
        hr_clinic_sign_date: {
            type: DataTypes.DATE,
        },
        sid_txt1: {
            type: DataTypes.STRING,
        },
        sid_txt2: {
            type: DataTypes.STRING,
        },
        sid_txt3: {
            type: DataTypes.STRING,
        },
        sid_fparty_sign: {
            type: DataTypes.STRING,
        },
        sid_fparty_name: {
            type: DataTypes.STRING,
        },
        sid_fparty_position: {
            type: DataTypes.STRING,
        },
        sid_sparty_name: {
            type: DataTypes.STRING,
        },
        sid_sparty_passport: {
            type: DataTypes.STRING,
        },
        sid_sparty_address: {
            type: DataTypes.STRING,
        },
        sid_sparty_date: {
            type: DataTypes.DATE,
        },
        
    }, {
        tableName: 'induction_program',
    });

    // Define the association: InductionProgram belongs to StaffDetails
    InductionProgram.associate = function (models) {
        InductionProgram.belongsTo(models.StaffDetails, {
            foreignKey: 'staff_id',
            targetKey: 'staff_id',
            onDelete: 'CASCADE',
          });
    };

    return InductionProgram;
};
