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
		indexes: [
			{ unique: true, fields: ["residence_number"] },
			{ unique: true, fields: ["id"] },
		],
		timestamps: true,
		underscored: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
	}
);

Residences.hasMany(Demographics, {
	foreignKey: { allowNull: false },
});

Demographics.belongsTo(Residences);

module.exports = Residences;
