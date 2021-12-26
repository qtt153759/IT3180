const createError = require("http-errors");
const role = require("../constance/role");

const author = (permission) => {
	permission.concat(role.ADMIN, role.TO_TRUONG, role.TO_PHO);
	return (req, res, next) => {
		try {
			if (!req.role || !permission.includes(role))
				throw createError.Unauthorized();

			next();
		} catch (err) {
			next(err);
		}
	};
};

module.exports = author;
