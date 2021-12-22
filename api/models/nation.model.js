const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Nation = sequelize.define("nation", {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	additionalName: {
		type: DataTypes.STRING,
	},
});

// Nation.associations();

module.exports = Nation;
