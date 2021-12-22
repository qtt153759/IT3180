const createHttpError = require("http-errors");
const createSuccess = require("../helpers/respose.success");
const Demographics = require("../models/demographics.model");
const AbsentStay = require("../models/absentStay.model");
// Created and save a new demographics
let createAbsent = async (req, res, next) => {
	try {
		let { demographic_id, fromDate, toDate, note, address, type } =
			req.body;
		if (!(demographic_id && fromDate && toDate && address && type)) {
		}
		const exist = await AbsentStay.findOne({
			where: {
				demographic_id: demographic_id,
				fromDate: fromDate,
				toDate: toDate,
				type: type,
				isDeleted: false,
			},
		});
		if (exist) {
			throw createHttpError(500, "this absent exist");
		}
		AbsentStay.create(req.body)
			.then((data) => {
				return res.send(createSuccess(data));
			})
			.catch((err) => {
				next(createHttpError(500, err));
			});
	} catch (err) {
		next(err);
	}
};
let createStay = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			let { demographic_id, fromDate, toDate, note, address, type } =
				data;
			if (!(demographic_id && fromDate && toDate && address && type)) {
				throw createHttpError(500, "Missing parameter");
			}
			const exist = await AbsentStay.findOne({
				where: {
					demographic_id: demographic_id,
					fromDate: fromDate,
					toDate: toDate,
					type: type,
					isDeleted: false,
				},
			});
			if (exist) {
				throw createHttpError(500, "this absent exist");
			}
			stay = await AbsentStay.create(data);
			if (stay) {
				resolve(data);
			} else {
				throw createHttpError(500, "can't create stay");
			}
		} catch (err) {
			reject(err);
		}
	});
};
let getAllStayAbsent = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let condition = {};
		condition.isDeleted = false;
		if (req.query.type) {
			let arrType = req.query.type.split(",");
			let conditionType = [];
			for (let i = 0; i < arrType.length; i++) {
				conditionType.push(+arrType[i]);
			}
			condition.type = conditionType;
		}
		AbsentStay.findAndCountAll({
			where: condition,
			include: [
				{
					model: Demographics,
					as: "absentStay",
				},
			],
			limit: limit,
			offset: (page - 1) * limit,
		})
			.then((data) => {
				res.send(createSuccess(data.rows, data.count, page, limit));
			})
			.catch((err) => {
				next(createHttpError(500, err));
			});
	} catch (err) {
		next(err);
	}
};
let getStayAbsentById = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		if (!req.params.id) {
			throw createHttpError(500, "Missing id params");
		}
		AbsentStay.findAndCountAll({
			where: { demographic_id: req.params.id },
			include: [
				{
					model: Demographics,
					as: "absentStay",
				},
			],
			limit: limit,
			offset: (page - 1) * limit,
		})
			.then((data) => {
				res.send(createSuccess(data.rows, data.count, page, limit));
			})
			.catch((err) => {
				next(createHttpError(500, err));
			});
	} catch (err) {
		next(err);
	}
};

module.exports = {
	createAbsent,
	createStay,
	getAllStayAbsent,
	getStayAbsentById,
};
