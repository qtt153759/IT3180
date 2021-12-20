const accountService = require("../services/account.service");
const { userValidator } = require("../helpers/validator");
const createError = require("http-errors");


//ham login
let handleLogin = async (req, res, next) => {
	try {
		const { error } = userValidator(req.body); //validate
		if (error) throw createError(500, error.details[0].message);

		let userData = await accountService.handleUserLogin(req.body); //tao file accountservice rieng cho gon
		return res.status(200).json({
			message: userData.errMessage,
			user: userData.user ? userData.user : {},
		});
	} catch (err) {
		next(err);
	}
};

//ham tao tai khoan
let createAccount = async (req, res, next) => {
	try {
		const { error } = userValidator(req.body); //validate
		if (error) throw createError(500, error.details[0].message);

		let userData = await accountService.createUserAccount(req.body); //tao file accountservice rieng cho gon
		return res.status(200).json({
			message: userData.errMessage,
			user: userData.user ? userData.user : {},
		});
	} catch (err) {
		next(err);
	}
};
module.exports = {
	handleLogin,
	createAccount,
};
