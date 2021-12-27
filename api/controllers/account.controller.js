const accountService = require("../services/account.service");
const { userValidator } = require("../helpers/validator");
const { signToken } = require("../helpers/jwt.helper");
const createError = require("http-errors");
const createSuccess = require("../helpers/respose.success");
const Account = require("../models/account.model");

let handleLogin = async (req, res, next) => {
	try {
		const { error } = userValidator(req.body);
		if (error) throw createError(500, error.details[0].message);

		const user = await accountService.handleUserLogin(req.body);
		const token = await signToken(user.id);

		return res.send(createSuccess({ user, token }));
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

const getProfile = async (req, res, next) => {
	try {
		const id = req.id;
		const account = await Account.findOne({
			where: id,
			raw: true,
		});

		delete account.password;
		res.send(createSuccess(account));
	} catch (err) {
		next(err);
	}
};

const getAllAccount = async (req, res, next) => {
	try {
		const page = +req.query || 1;
		const limit = +req.query || 10;

		const accounts = await Account.findAndCountAll({
			raw: true,
			limit: limit,
			offset: (page - 1) * limit,
			order: [["updatedAt", "DESC"]],
		});

		delete accounts.password;
		res.send(createSuccess(accounts.rows, accounts.count, page, limit));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	handleLogin,
	createAccount,
	getProfile,
	getAllAccount,
};
