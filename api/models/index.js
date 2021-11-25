const config = require("../config/config");
const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
	config.db.DB_NAME,
	config.db.DB_USER,
	config.db.DB_PASS,
	{
		host: config.db.DB_HOST,
		dialect: config.db.dialect,
		operatorsAliases: false,
		pool: {
			max: config.db.pool.max,
			min: config.db.pool.min,
			acquire: config.db.pool.acquire,
			idle: config.db.pool.idle,
		},
	}
);
