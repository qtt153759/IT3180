const { DataTypes } = require("sequelize");
const Donate = require("./donate.model");
const sequelize = require("./index");
const Donate2Residence = sequelize.define(
	"donate2Residences",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		donate_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		residence_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		money: {
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


module.exports = Donate2Residence;
