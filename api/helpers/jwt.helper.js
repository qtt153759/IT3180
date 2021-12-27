const createError = require("http-errors");
const JWT = require("jsonwebtoken");
require("dotenv").config();
const signature = "secrect";

const signToken = async (userId) => {
	return new Promise((resolve, reject) => {
		const payload = {
			id: userId,
		};

		// eslint-disable-next-line no-undef
		const secrect = signature;
		const option = {
			expiresIn: "100d",
		};

		JWT.sign(payload, secrect, option, (err, token) => {
			if (err) reject(err);
			resolve(token);
		});
	});
};

const verifyToken = (token) => {
	try {
		return JWT.verify(token, signature, (err, payload) => {
			if (err) {
				console.log(err);
				throw createError.InternalServerError();
			} else return payload;
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
