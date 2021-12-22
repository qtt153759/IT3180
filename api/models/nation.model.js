const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
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

	// Nation.belongsTo(Demographics);
    return Nation
};
