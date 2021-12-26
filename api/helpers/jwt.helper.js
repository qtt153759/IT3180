const createError = require("http-errors");
const JWT = require("jsonwebtoken");
require("dotenv").config();

const signToken = async (userId) => {
	return new Promise((resolve, reject) => {
		const payload = {
			id: userId,
		};

		// eslint-disable-next-line no-undef
		const secrect = process.env.SECRET_KEY;
		const option = {
			expiresIn: "1h",
		};

		JWT.sign(payload, secrect, option, (err, token) => {
			if (err) reject(err);
			resolve(token);
		});
	});
};

const verifyToken = (token) => {
	try {
		JWT.verify(token, process.env.SECRET_KEY, (err, payload) => {
			if (err) throw createError.InternalServerError();
			else return payload;
		});
	} catch (err) {
		console.log(err);
		throw err;
	}
};

module.exports = {
	signToken,
	verifyToken,
};
