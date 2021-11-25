const { DataTypes } = require("sequelize");
const sequelize = require("./index");

module.exports = sequelize.define(
	"demographics",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		firstname: {
			type: DataTypes.STRING(255),
			// field:
		},
		lastname: {
			type: DataTypes.STRING(100),
		},
		alias: {
			type: DataTypes.STRING,
		},
		nation: {
			type: DataTypes.INTEGER,
		},
		birthday: {
			type: DataTypes.DATE,
		},
		birthAddress: {
			type: DataTypes.STRING,
		},
		job: {
			type: DataTypes.STRING,
		},
		jobAddress: {
			type: DataTypes.STRING,
		},
		identityCardNumber: {
			type: DataTypes.INTEGER,
		},
		identityCardCreateDate: {
			type: DataTypes.STRING,
		},
		identityCardAddress: {
			type: DataTypes.STRING,
		},
		registerResidentDate: {
			type: DataTypes.STRING,
		},
		lastResidentAddress: {
			type: DataTypes.STRING,
		},
		relationshipWithHeader: {
			type: DataTypes.STRING,
		},
		role: {
			type: DataTypes.STRING,
		},
		status: {
			allowNull: false,
			type: DataTypes.INTEGER,
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
