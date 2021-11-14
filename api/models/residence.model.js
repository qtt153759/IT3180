const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	return sequelize.define(
		"residence",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
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
		},
		{
			timestamps: true,
			underscored: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);
};
