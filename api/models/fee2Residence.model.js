const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
	const Fee2Residence = sequelize.define(
		"Fee2Residence",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			fee_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			residence_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			money: {
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
	// Fee2Residence.associate = (models) => {
	// 	Fee2Residence.hasOne(models.Fee);
	// };
	return Fee2Residence
};
