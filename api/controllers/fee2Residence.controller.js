const createHttpError = require("http-errors");
const createSuccess = require("../helpers/respose.success");
// const Fee2Residence = require("../models/Fee2Residence.model");
const db = require("../models/index");
const Fee2Residence = db.fee2Residence;
const Fee = db.fee;
let getAllFee2Residence = async (req, res, next) => {
	try {
		console.log("vao controller");
		await Fee2Residence.findAll({
			include: [
				{
					model: Fee,
					attributes: ["name", "description"],
					required: true,
				},
			],
		})
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
let getFee2ResidenceByResidence = async (req, res, next) => {
	try {
		console.log("vao controller");
		if (!req.params.id) {
			throw createHttpError(400, "params missing residenc_id!");
		}
		let id = req.params.id;
		await Fee2Residence.findAll({
			where: { residence_id: id },
			include: [
				{
					model: Fee,
					attributes: ["name", "description"],
					required: true,
				},
			],
		})
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
let getFee2ResidenceByFee = async (req, res, next) => {
	try {
		console.log("vao controller");
		if (!req.params.id) {
			throw createHttpError(400, "params missing residenc_id!");
		}
		let id = req.params.id;
		await Fee2Residence.findAll({
			where: { fee_id: id },
			include: [
				{
					model: Fee,
					attributes: ["name", "description"],
					required: true,
				},
			],
		})
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
let createFee2Residence = async (req, res, next) => {
	try {
		console.log("vao controller create");
		if (
			!req.body ||
			!req.body.fee_id ||
			!req.body.residence_id ||
			!req.body.money
		) {
			throw createHttpError(400, "body missing field!");
		} else if (req.body.money <= 0) {
			throw createHttpError(400, "money must be positive!");
		}

		console.log(req.body);
		const exist = await Fee2Residence.findOne({
			where: {
				fee_id: req.body.fee_id,
				residence_id: req.body.residence_id,
			},
		});
		if (exist)
			throw createHttpError(400, "Dupicate both fee_id and residence_id");

		const data = await Fee2Residence.create(req.body);

		return res.send(createSuccess(data));
	} catch (err) {
		next(err);
	}
};
let updateFee2Residence = async (req, res, next) => {
	try {
		if (
			!req.body ||
			!req.body.id ||
			!req.body.fee_id ||
			!req.body.residence_id ||
			!req.body.money
		) {
			throw createHttpError(400, "body missing field!");
		} else if (req.body.money <= 0) {
			throw createHttpError(400, "money must be positive!");
		}
		const exist = await Fee2Residence.findOne({
			where: {
				fee_id: req.body.fee_id,
				residence_id: req.body.residence_id,
			},
		});
		if (exist)
			throw createHttpError(400, "Dupicate both fee_id and residence_id");
		Fee2Residence.update(req.body, {
			where: {
				id: id,
				isDeleted: false,
			},
		})
			.then(async () => {
				Fee2Residence.findOne({
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

let deleteFee2Residence = async (req, res, next) => {
	try {
		const id = req.params.id;
		console.log("id", id);
		Fee2Residence.update(
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
	getFee2ResidenceByResidence,
	getAllFee2Residence,
	createFee2Residence,
	updateFee2Residence,
	deleteFee2Residence,
	getFee2ResidenceByFee,
};
