const accountService = require("../services/account.service");
const { userValidator } = require("../helpers/validator");
const { signToken } = require("../helpers/jwt.helper");
const createError = require("http-errors");
const createSuccess = require("../helpers/respose.success");

let handleLogin = async (req, res, next) => {
	try {
		const { error } = userValidator(req.body);
		if (error) throw createError(500, error.details[0].message);

		const user = await accountService.handleUserLogin(req.body);
		const token = await signToken(user.id);

		return res.send(createSuccess({ token }));
	} catch (err) {
		next(err);
	}
};

let createAccount = async (req, res, next) => {
	try {
		const { error } = userValidator(req.body); //validate
		if (error) throw createError(500, error.details[0].message);

		const user = await accountService.createUserAccount(req.body); //tao file accountservice rieng cho gon
		const token = await signToken(user.id);

		return res.send(createSuccess({ user, token }));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	handleLogin,
	createAccount,
};
