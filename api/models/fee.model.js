const { DataTypes } = require("sequelize");
// const sequelize = require("./index");
module.exports=(sequelize)=>{
	const Fee = sequelize.define(
		"Fee",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING(255),
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
	// Fee.associate = (models) => {
	// 	Fee.belongsTo(models.Fee2,{foreignKey:"id"});
	// };
	return Fee
}
