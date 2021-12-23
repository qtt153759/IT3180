const { DataTypes } = require("sequelize");
const Demographics = require("./demographics.model");
const sequelize = require("./index");

const Residences = sequelize.define(
	"residences",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		residence_number: {
			type: DataTypes.STRING,
			allowNull: false,
		}, 
		headerId: {
			type: DataTypes.INTEGER,
		},
		provinceId: {
			type: DataTypes.INTEGER,
		},
		districtId: {
			type: DataTypes.INTEGER,
		},
		wardId: {
			type: DataTypes.INTEGER,
		},
		address: {
			type: DataTypes.STRING,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
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

Residences.hasMany(Demographics, {
	as: "demographics",
	foreignKey: { name: "residenceId", allowNull: false },
});

module.exports = Residences;
