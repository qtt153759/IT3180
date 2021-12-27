const { DataTypes } = require("sequelize");

const sequelize = require("./index");

const Account = sequelize.define(
	"Account",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		role: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		indexes: [
			{unique: true, fields: ["email"]},
			{unique: true, fields: ["id"]}

		],
		timestamps: true,
		underscored: true,
		createdAt: true,
		updatedAt: true,
	}
);

module.exports = Account;
