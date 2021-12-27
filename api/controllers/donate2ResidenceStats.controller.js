const createHttpError = require("http-errors");
const createSuccess = require("../helpers/respose.success");
const Donate = require("../models/donate.model");
const Donate2Residence = require("../models/donate2Residence.model");
const Residence = require("../models/residence.model");
const { Sequelize, Op } = require("sequelize");
const Demographics = require("../models/demographics.model");
let getDonateStatsById = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let { id } = req.params;
		Donate2Residence.findAll({
			where: { isDeleted: false, donate_id: id },
			limit: limit,
			offset: (page - 1) * limit,
			attributes: [
				"donate_id",
				[
					Sequelize.fn("COUNT", Sequelize.col("residence_id")),
					"countResidence",
				],
				[Sequelize.fn("SUM", Sequelize.col("money")), "sumMoney"],
				[Sequelize.fn("MAX", Sequelize.col("money")), "maxMoney"],
			],
			include: [
				{
					model: Donate,
					as: "donate",
				},
			],
			raw: true,
			nest: true,
		})
			.then(async (data) => {
				let residence = await Residence.findAndCountAll({
					where: { isDeleted: false },
				});
				let totalResidence = residence.count;
				let maxResidence = await Donate2Residence.findOne({
					where: {
						donate_id: id,
						money: data[0].maxMoney,
						isDeleted: false,
					},
					raw: true,
					nest: true,
				});
				data[0] = { ...data[0], maxResidence, totalResidence };
				res.send(createSuccess(data[0]));
			})
			.catch((err) => {
				next(createHttpError(500, err));
			});
	} catch (err) {
		next(err);
	}
};
let getResidenceStatsById = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let { id } = req.params;

		Donate2Residence.findAll({
			where: { isDeleted: false, residence_id: id },
			limit: limit,
			offset: (page - 1) * limit,
			attributes: [
				"residence_id",
				[
					Sequelize.fn("COUNT", Sequelize.col("donate_id")),
					"countResidence",
				],
				[Sequelize.fn("SUM", Sequelize.col("money")), "sumMoney"],
				[Sequelize.fn("MAX", Sequelize.col("money")), "maxMoney"],
			],
			include: [
				{
					model: Residence,
					as: "residence",
				},
			],
			raw: true,
			nest: true,
		})
			.then(async (data) => {
				let donate = await Donate.findAndCountAll({
					where: { isDeleted: false },
				});
				let totalDonate = donate.count;
				let maxDonate = await Donate2Residence.findOne({
					where: {
						residence_id: id,
						money: data[0].maxMoney,
						isDeleted: false,
					},
					raw: true,
					nest: true,
				});
				data[0] = { ...data[0], maxDonate, totalDonate };
				res.send(createSuccess(data[0]));
			})
			.catch((err) => {
				next(createHttpError(500, err));
			});
	} catch (err) {
		next(err);
	}
};
let getDonateStats = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let condition = { isDeleted: false };
		let idList = [];
		if (req.query && req.query.type) {
			let conditionDonate = { isDeleted: false };
			console.log("type", req.query.type);
			if (+req.query.type === 1) {
				conditionDonate = { type: 1 };
			} else {
				conditionDonate = { type: 2 };
			}
			let donate = await Donate.findAll({
				where: conditionDonate,
				raw: true,
			});
			for (let i = 0; i < donate.length; i++) {
				idList.push(donate[i].id);
			}
			console.log("condition", idList);
			condition.donate_id = { [Op.in]: idList };
		}
		console.log("condition", condition);
		Donate2Residence.findAndCountAll({
			where: condition,
			limit: limit,
			offset: (page - 1) * limit,
			attributes: [
				"donate_id",
				[
					Sequelize.fn("COUNT", Sequelize.col("residence_id")),
					"countResidence",
				],
				[Sequelize.fn("SUM", Sequelize.col("money")), "sumMoney"],
				[Sequelize.fn("MAX", Sequelize.col("money")), "maxMoney"],
			],
			include: [
				{
					model: Donate,
					as: "donate",
				},
			],
			group: ["donate_id"],
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
let getResidenceStats = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let condition = { isDeleted: false };
		let idList = [];
		if (req.query && req.query.type) {
			let conditionDonate = { isDeleted: false };
			console.log("type", req.query.type);
			if (+req.query.type === 1) {
				conditionDonate = { type: 1 };
			} else {
				conditionDonate = { type: 2 };
			}
			let donate = await Donate.findAll({
				where: conditionDonate,
				raw: true,
			});
			for (let i = 0; i < donate.length; i++) {
				idList.push(donate[i].id);
			}
			console.log("condition", idList);
			condition.donate_id = { [Op.in]: idList };
		}
		Donate2Residence.findAndCountAll({
			where: condition,
			limit: limit,
			offset: (page - 1) * limit,
			attributes: [
				"residence_id",
				[
					Sequelize.fn("COUNT", Sequelize.col("donate_id")),
					"countDonate",
				],
				[Sequelize.fn("SUM", Sequelize.col("money")), "sumMoney"],
				[Sequelize.fn("MAX", Sequelize.col("money")), "maxMoney"],
			],
			include: [
				{
					model: Residence,
					as: "residence",
				},
			],
			group: ["residence_id"],
		})
			.then((data) => {
				console.log("data hanoi", data);
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
	getDonateStats,
	getDonateStatsById,
	getResidenceStats,
	getResidenceStatsById,
};
