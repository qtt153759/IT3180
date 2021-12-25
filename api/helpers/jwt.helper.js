const JWT = require("jsonwebtoken");
const { process } = require("dotenv").config();

const signAccessToken = async (userId) => {
	return new Promise((resolve, reject) => {
		const payload = {
			userId,
		};

		const secrect = process.env.rescrect;
		const option = {
			expiresIn: "1h",
		};

        
		JWT.sign(payload, secrect, option, (err, token) => {
			if (err) reject(err);
			resolve(token);
		});
	});
};

module.exports = {
	signAccessToken,
};
