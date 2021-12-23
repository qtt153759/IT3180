const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const Demographics = require("./demographics.model");

// const Account = require("./account.model");

const AbsentStay = sequelize.define(
	"AbsentStay",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		demographic_id: {
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

// AbsentStay.hasOne(Account);
AbsentStay.belongsTo(Demographics, {
	as: "demographic",
	foreignKey: { name: "demographic_id", allowNull: false },
});
module.exports = AbsentStay;
