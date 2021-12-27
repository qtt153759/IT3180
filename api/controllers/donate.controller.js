const createHttpError = require("http-errors");
const createSuccess = require("../helpers/respose.success");
const Donate = require("../models/donate.model");
const Donate2Residence = require("../models/donate2Residence.model");
let getDonate = async (req, res, next) => {
	try {
		console.log("vao controller");
		let condition = { isDeleted: false };
		if (req.query.type) {
			condition.type = req.query.type;
		}
		Donate.findAll({ where: condition, order: [["updatedAt", "DESC"]] })
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
let getDonateById = async (req, res, next) => {
	try {
		const id = req.params.id;
		console.log("id", id);
		Donate.findOne({
			where: { isDeleted: false, id: id },
		})
			.then((data) => {
				console.log("data", data);
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
		if (!req.body || !req.body.name || !req.body.type) {
			throw createHttpError(400, "body missing field!");
		}
		//Nếu là thu phí thì buộc phải có fee
		console.log(req.body);
		if (
			req.body.type === 2 &&
			!(req.body.fee && req.body.unit && req.body.fee > 0)
		) {
			throw createHttpError(400, "phí thiếu tiền và unit!");
		}
		//Nếu phí đấy tồn tại r
		const exist = await Donate.findOne({
			where: { name: req.body.name, isDeleted: false },
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
		if (!req.body || !req.body.id || !req.body.name || !req.body.type) {
			throw createHttpError(400, "body missing field!");
		}
		if (
			req.body.type === 2 &&
			!(req.body.fee && req.body.unit && req.body.fee > 0)
		) {
			throw createHttpError(400, "phí thiếu tiền và unit!");
		}

		Donate.update(req.body, {
			where: { id: req.body.id, isDeleted: false },
		})
			.then(async () => {
				let data = await Donate.findOne({
					where: { id: req.body.id },
					raw: true,
				});
				if (data) {
					return res.send(createSuccess(data));
				} else {
					throw createHttpError(400, "error");
				}
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
	getDonateById,
};
