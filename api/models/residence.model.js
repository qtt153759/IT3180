const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define(
        "residence",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            header_id: {
                type: DataTypes.INTEGER,

            },
            province_id: {
                type: DataTypes.INTEGER,
            },
            district_id: {
                type: DataTypes.INTEGER,
            },
            ward_id: {
                type: DataTypes.INTEGER,
            },
            address: {
                type:DataTypes.STRING,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
            }
        },
        {
            timestamps: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    )
}
