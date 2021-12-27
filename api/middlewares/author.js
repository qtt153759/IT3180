const createError = require("http-errors");
const role = require("../constance/role");

const author = (permission) => {
	return (req, res, next) => {
		const fullpermission = permission.concat(
			role.ADMIN,
			role.TO_TRUONG,
			role.TO_PHO
		);
		try {
			if (!fullpermission.includes(req.role))
				throw createError.Unauthorized();

			next();
		} catch (err) {
			next(err);
		}
	};
};

module.exports = author;
