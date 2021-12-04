module.exports = {
	/** DATABASE */
	db: {
		DB_NAME: process.env.DB_NAME,
		DB_USER: process.env.DB_USER,
		DB_PASS: process.env.DB_PASS, //process.env.DB_PASSWORD
		DB_HOST: process.env.DB_HOST,
		dialect: "mysql",

		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	},

	/** AUTH KEY */
	auth: {
		secret: "key",
	},
};
