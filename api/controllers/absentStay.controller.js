const createHttpError = require("http-errors");
const createSuccess = require("../helpers/respose.success");
const Demographics = require("../models/demographics.model");
const AbsentStay = require("../models/absentStay.model");
// Created and save a new demographics
let createAbsentStay = async (req, res, next) => {
	try {
		let { demographic_id, fromDate, toDate, note, address, type } =
			req.body;
		if (!(demographic_id && fromDate && toDate && address && type)) {
		}
		const demographicExist = await Demographics.findOne({
			where: { id: demographic_id, isDeleted: false, isDead: false },
		});
		if (!demographicExist) {
			throw createHttpError(500, "this demographic_id is not existed");
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
			throw createHttpError(
				500,
				"this absent or stay is already existed"
			);
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

let getAllStayAbsent = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let orderColumn = req.query.orderColumn || "id";
		let orderDirection = req.query.orderDirection || "DESC";
		let order = [orderColumn, orderDirection];

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
					as: "demographic",
				},
			],
			order: [order],
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
		AbsentStay.findAndCountAll({
			where: { id: req.params.id },
			include: [
				{
					model: Demographics,
					as: "demographic",
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
	createAbsentStay,
	getAllStayAbsent,
	getStayAbsentById,
};
