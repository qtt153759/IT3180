const createHttpError = require("http-errors");

const { verifyToken } = require("../helpers/jwt.helper");
const Account = require("../models/account.model");

const authen = async (req, res, next) => {
	try {
		if (!req.header.Authorization) throw createHttpError.Unauthorized();

		const authHeader = req.header.Authorization;
		const bearerToken = authHeader.split(" ");
		const token = bearerToken[1];

		const payload = verifyToken(token);
		if (!payload) throw createHttpError.Unauthorized();

		const account = await Account.findOne({
			where: payload.id,
		});
		if (!account) throw createHttpError.Unauthorized();

		req.role = account.role;

		next();
	} catch (err) {
		next(err);
	}
};

module.exports = authen;
