module.exports = {
    /** DATABASE */
    db: {
        DB_NAME: "quanlydancu",
        DB_USER: "root",
        DB_PASS: null,//process.env.DB_PASSWORD
        DB_HOST: process.env.DB_HOST,
        dialect: "mysql",

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },

    /** AUTH KEY */
    auth: {
        secret: "key"
    }
};
