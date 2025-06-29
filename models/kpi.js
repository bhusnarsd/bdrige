module.exports = (sequelize, DataTypes) => {
    const Kpi = sequelize.define('kpi', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Automatically created as a unique primary key
            autoIncrement: true, // This will auto-increment for each new row
        },
        staff_id: {
            type: DataTypes.STRING,
            references: {
                model: 'staff_details', // Table name
                key: 'staff_id',
            }
        },
        // staff_name: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        // },
        kpi_date: {
            type: DataTypes.DATE,
        },
        department: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        e_period: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        kpi_text1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        kpi_text2: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        kpi_text3: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        kpi_text4: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        kpi_text5: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        staff_sign: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        hod_sign: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        rating_scale: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg1_art: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg1_rwad: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg1_rws: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg1_mbc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg1_ppc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg1_sum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        trg2_pos: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg2_sft: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg2_ccapc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg2_caos: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg2_ps: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg2_counslng: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg2_sum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        trg3_cs: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg3_dm: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg3_init: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg3_cp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg3_gps: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg3_tw: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg3_sum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sasndtq1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sasndtq2: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sasndtq3: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sasndtq4: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sasndtq5: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sasndtq6: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trg_total: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ps_scale: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hr_sign: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        director_sign: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        staff_sign1: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        hod_sign1: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        pdf_path: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'kpi',
    });

    Kpi.associate = function(models) {
        // RIGHT:
        Kpi.belongsTo(models.StaffDetails, {
          foreignKey: 'staff_id',
          targetKey: 'staff_id',
          as: 'StaffDetail'
        });
      };
      
    return Kpi;
};
