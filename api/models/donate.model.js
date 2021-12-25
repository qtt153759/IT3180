const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const Donate2Residence = require("../models/donate2Residence.model");

const Donate = sequelize.define(
	"donate",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING(255),
		},
		type: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		unit: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		fee: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
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
Donate.hasMany(Donate2Residence, {
	as: "donate",
	foreignKey: { name: "donate_id", allowNull: false },
});
Donate2Residence.belongsTo(Donate, {
	as: "donate",
	foreignKey: { name: "donate_id", allowNull: false },
});
module.exports = Donate;
