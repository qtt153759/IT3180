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
		demographicId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		fromDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		toDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		note: {
			type: DataTypes.STRING(255),
		},
		type: {
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

ResidenceHistory.belongsTo(Residences, {
	as: "ResidenceChange",
	foreignKey: { name: "residence_id", allowNull: false },
});

module.exports = ResidenceHistory;
