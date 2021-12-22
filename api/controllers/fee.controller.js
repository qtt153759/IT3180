const createHttpError = require("http-errors");
const createSuccess = require("../helpers/respose.success");
const db = require("../models/index");
const Fee=db.fee
let getFee = async (req, res, next) => {
	try {
		console.log("vao controller");
		await Fee.findAll()
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
let createFee = async (req, res, next) => {
	try {
		console.log("vao controller create");
		if (!req.body || !req.body.name || !req.body.description) {
			throw createHttpError(400, "body missing field!");
		}
		console.log(req.body);
		const exist = await Fee.findOne({
			where: { name: req.body.name },
		});
		if (exist) throw createHttpError(400, "Dupicate name of fee");

		const data = await Fee.create(req.body);

		return res.send(createSuccess(data));
	} catch (err) {
		next(err);
	}
};
let updateFee = async (req, res, next) => {
	try {
		let { id } = req.body;
		if (!id) {
			throw createHttpError(400, "Missing 'id' field");
		}
		Fee.update(req.body, {
			where: {
				id: id,
				isDeleted: false,
			},
		})
			.then(async () => {
				Fee.findOne({
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

let deleteFee = async (req, res, next) => {
	try {
		const id = req.params.id;
		console.log("id", id);
		Fee.update(
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
			.then((data) => {
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
	getFee,
	createFee,
	updateFee,
	deleteFee,
};
