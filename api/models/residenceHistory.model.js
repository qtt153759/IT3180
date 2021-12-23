const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Residences = require("./residence.model");

const ResidenceHistory = sequelize.define(
	"ResidenceHistory",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		residenceId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		demographicId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		fromDate: {
			type: DataTypes.DATE,
		},
		toDate: {
			type: DataTypes.DATE,
		},
		address: {
			type: DataTypes.STRING(255),
		},
		note: {
			type: DataTypes.STRING(255),
		},
		fromType: {
			type: DataTypes.INTEGER,
		},
		toType: {
			type: DataTypes.INTEGER,
		},
		createdAt: {
			type: DataTypes.DATE,
		},
		updatedAt: {
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

ResidenceHistory.belongsTo(Residences, {
	as: "ResidenceChange",
	foreignKey: { name: "residenceId", allowNull: false, underscored: true },
});

module.exports = ResidenceHistory;
