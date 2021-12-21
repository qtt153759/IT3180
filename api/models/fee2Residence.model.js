const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Fee2Residence = sequelize.define(
    "Fee2Residence",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        fee_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        residence_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        money:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        timestamps: true,
        underscored: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    }
);
// Fee2Residence.associate()
module.exports = Fee2Residence;
