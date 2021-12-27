const createHttpError = require("http-errors");

const { verifyToken } = require("../helpers/jwt.helper");
const Account = require("../models/account.model");

const authen = async (req, res, next) => {
	try {
		if (!req.headers) throw createHttpError.Unauthorized();

		const authHeader =
			req.headers.authorization || req.headers.Authorization;

		if (!authHeader) throw createHttpError(401, "access token not found");

		const bearerToken = authHeader.split(" ");
		const token = bearerToken[1];

		const payload = await verifyToken(token);
		if (!payload) throw createHttpError.Unauthorized();

		const account = await Account.findOne({
			where: payload.id,
		});

		if (!account) throw createHttpError.Unauthorized();

		req.id = payload.id;
		req.role = account.role;

		next();
	} catch (err) {
		next(err);
	}
};

module.exports = authen;
