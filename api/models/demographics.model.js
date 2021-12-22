const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Demographics = sequelize.define(
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
			allowNull: false,
		},
		lastname: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		gender: {
			type: DataTypes.STRING,
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
			type: DataTypes.STRING,
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
		domicile: {
			type: DataTypes.STRING,
		},
		movingAddress: {
			type: DataTypes.STRING,
		},
		movingDate: {
			type: DataTypes.DATE,
		},
		movingNote: {
			type: DataTypes.STRING,
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

Demographics.associate = (models) => {
	Demographics.hasOne(models.Account);

	Demographics.hasOne(models.Nation, {
		foreignKey: "id",
	});
};

module.exports = Demographics;
