const Account = require("../models/account.model");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (dataLogin) => {
	return new Promise(async (resolve, reject) => {
		try {
			const password = dataLogin.password;
			const email = dataLogin.email;
			let userData = {};
			let isExsit = await checkUserEmail(email);
			if (isExsit) {
				let user = await Account.findOne({
					attributes: ["email", "role", "password", "demographic_id"], //select
					where: { email: email },
					raw: true,
				});
				if (user) {
					let check = await bcrypt.compareSync(
						password,
						user.password
					);
					if (check) {
						userData.errMessage = "Login successful";
						delete user.password; //sau khi attributes ma muon an thuoc tinh nao thi delete
						userData.user = user;
					} else {
						throw createError(500, "wrong password");
					}
				} else {
					throw createError(500, "user not found");
				}
			} else {
				throw createError(500, "your email isn't exsist");
			}
			resolve(userData);
		} catch (er) {
			reject(er);
		}
	});
};

let createUserAccount = (dataRegister) => {
	return new Promise(async (resolve, reject) => {
		try {
			let userData = {};
			let isExsit = await checkUserEmail(dataRegister.email); //kiem tra email co ton tai
			if (isExsit) {
				throw createError(500, "Your email has already exsited");
			} else {
				let hashPasswordFromBcrypt = await hashUserPassword(
					dataRegister.password
				);
				await Account.create({
					email: dataRegister.email,
					password: hashPasswordFromBcrypt,
					role: dataRegister.role,
					demographic_id: dataRegister.demographic_id,
				});
				userData.errMessage = "Register successful";
				delete dataRegister.password;
				userData.user = dataRegister;
			}
			resolve(userData);
		} catch (er) {
			reject(er);
		}
	});
};
let checkUserEmail = async (userEmail) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await Account.findOne({
				where: { email: userEmail },
			});
			if (user) {
				resolve(true);
			} else {
				resolve(false);
			}
		} catch (err) {
			reject(err);
		}
	});
};
let hashUserPassword = (password) => {
	return new Promise(async (resolve, reject) => {
		try {
			let hashPassword = await bcrypt.hashSync(password, salt);
			resolve(hashPassword);
		} catch (ex) {
			reject(ex);
		}
	});
};
module.exports = {
	//luu y jo duong exports={handleUserLogin:handleUserLogin}  vi se co lôi handleUserLogin is not function=>luc nao cung dung module.export
	handleUserLogin,
	createUserAccount,
};
