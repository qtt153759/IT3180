const Account = require("../models/account.model");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (dataLogin) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { email, password } = dataLogin;
			if (!email || !password) throw createError.Unauthorized();

			const exist = await checkEmailExist(email);
			if (!exist) throw createError.Unauthorized();

			const user = await Account.findOne({
				where: { email },
				raw: true,
			});

			if (!user) throw createError.Unauthorized();

			let correctPassword = bcrypt.compareSync(password, user.password);

			if (!correctPassword) throw createError.Unauthorized();
			delete user.password;
			resolve(user);
		} catch (err) {
			reject(err);
		}
	});
};

let createUserAccount = ({ email, password, role }) => {
	return new Promise(async (resolve, reject) => {
		try {
			let hashedPassword = await hashUserPassword(password);

			const account = await Account.create({
				email,
				password: hashedPassword,
				role,
			});

			resolve(account);
		} catch (err) {
			reject(err);
		}
	});
};

let checkEmailExist = async (email) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await Account.findOne({
				where: { email },
			});

			resolve(user ? true : false);
		} catch (err) {
			reject(err);
		}
	});
};

let hashUserPassword = (password) => {
	return new Promise((resolve, reject) => {
		try {
			let hashPassword = bcrypt.hashSync(password, salt);
			resolve(hashPassword);
		} catch (err) {
			reject(err);
		}
	});
};

module.exports = {
	//luu y jo duong exports={handleUserLogin:handleUserLogin}  vi se co lôi handleUserLogin is not function=>luc nao cung dung module.export
	handleUserLogin,
	createUserAccount,
};
