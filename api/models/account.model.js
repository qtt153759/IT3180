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
		demographic_id: {
			type: DataTypes.STRING(255),
			allowNull: false,
			// field:
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
		timestamps: true,
		underscored: true,
		createdAt: true,
		updatedAt: true,
	}
);

Account.associate = (models) => {
	Account.belongsTo(models.User, { foreignKey: "id", as: "demographicData" });
};

module.exports = Account;
