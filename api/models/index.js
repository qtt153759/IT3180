const config = require("../config/config");
const { Sequelize, Op } = require("sequelize");

const sequelize = new Sequelize(
	config.db.DB_NAME,
	config.db.DB_USER,
	config.db.DB_PASS,
	{
		host: config.db.DB_HOST,
		dialect: config.db.dialect,
		pool: {
			max: config.db.pool.max,
			min: config.db.pool.min,
			acquire: config.db.pool.acquire,
			idle: config.db.pool.idle,
		},
	}
);
const db = {
	Op: Op,
	sequelize: sequelize,
};

(db.fee = require("./fee.model")(sequelize)),
	(db.fee2Residence = require("./fee2Residence.model")(sequelize));
db.demographic = require("./demographics.model")(sequelize);
db.residence = require("./residence.model")(sequelize);
db.account = require("./account.model")(sequelize);
db.nation = require("./nation.model")(sequelize);

db.fee2Residence.belongsTo(db.fee, { foreignKey: "fee_id" });
db.fee.hasOne(db.fee2Residence, { foreignKey: "fee_id" });

// db.demographic.belongsTo(db.nation, { foreignKey: "nation" });
// db.nation.hasOne(db.demographic, { foreignKey: "nation" });
module.exports = db;
