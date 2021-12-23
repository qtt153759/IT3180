const createHttpError = require("http-errors");
const createSuccess = require("../helpers/respose.success");
const Donate = require("../models/donate.model");
const Donate2Residence = require("../models/donate2Residence.model");
let getDonate = async (req, res, next) => {
	try {
		console.log("vao controller");
		await Donate.findAll()
			.then((data) => {
				res.send(createSuccess(data));
			})
			.catch((err) => {
				next(createHttpError(500, err));
			});
	} catch (err) {
		next(err);
	}
};
let createDonate = async (req, res, next) => {
	try {
		console.log("vao controller create");
		if (!req.body || !req.body.name || !req.body.description) {
			throw createHttpError(400, "body missing field!");
		}
		console.log(req.body);
		const exist = await Donate.findOne({
			where: { name: req.body.name },
		});
		if (exist) throw createHttpError(400, "Dupicate name of Donate");

		const data = await Donate.create(req.body);

		return res.send(createSuccess(data));
	} catch (err) {
		next(err);
	}
};
let updateDonate = async (req, res, next) => {
	try {
		let { id } = req.body;
		if (!id) {
			throw createHttpError(400, "Missing 'id' field");
		}
		Donate.update(req.body, {
			where: {
				id: id,
				isDeleted: false,
			},
		})
			.then(async () => {
				Donate.findOne({
					where: { id },
				})
					.then((data) => {
						return res.send(createSuccess(data));
					})
					.catch((err) => {
						throw createHttpError(500, err);
					});
			})
			.catch((err) => {
				next(createHttpError(500, err));
			});
	} catch (err) {
		next(err);
	}
};

let deleteDonate = async (req, res, next) => {
	try {
		const id = req.params.id;
		console.log("id", id);
		Donate.update(
			{
				isDeleted: true,
			},
			{
				where: {
					id,
					isDeleted: false,
				},
				returning: true,
				plain: true,
			}
		)
			.then(() => {
				return res.send(createSuccess());
			})
			.catch((err) => {
				throw err;
			});
	} catch (err) {
		next(err);
	}
};
module.exports = {
	getDonate,
	createDonate,
	updateDonate,
	deleteDonate,
};
