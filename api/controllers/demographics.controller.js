const Demographics = require("../models/demographics.model");
const createHttpError = require("http-errors");
const { demographicsValidator } = require("../helpers/validator");
const createSuccess = require("../helpers/respose.success");
const { Op } = require("sequelize");
const demographicsService = require("../services/demographics.service");

// Created and save a new demographics
let createDemographics = async (req, res, next) => {
	try {
		const { error } = demographicsValidator(req.body);
		if (error) throw createHttpError(500, error.details[0].message);
		let { firstname, lastname } = req.body;

		const exist = await Demographics.findOne({
			where: {
				firstname,
				lastname,
				isDeleted: false,
			},
		});

		if (exist) {
			throw createHttpError(500, "first name exist");
		}

		Demographics.create(req.body)
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

// Retrieve all demographics from the database
let retrieveAllDemographic = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;

		let condition = {};
		let include = [];
		let order = [];
		let where = {};

		where.isDeleted = false;
		condition.limit = limit;
		condition.offset = (page - 1) * limit;

		//create include giữa 2 model associate(chưa có model Gender)
		// if (req.query.gender) {
		// 	let item = {
		// 		model: Gender,
		// 		attributes: ["name"],
		// 		where: {
		// 			name: req.query.gender,
		// 		},
		// 	};
		// 	console.log("item");
		// 	include.push(item);
		// }

		if (req.query.gender) {
			where.gender = req.query.gender;
			console.log(req.query.gender);
		}

		if (req.query.age) {
			let rangeAge = demographicsService.checkAge(req.query.age);
			where.birthday = {
				[Op.between]: [
					new Date(
						new Date() -
							24 * 60 * 60 * 1000 * 365 * (await rangeAge).upper
					),
					new Date(
						new Date() -
							24 * 60 * 60 * 1000 * 365 * (await rangeAge).lower
					),
				],
			};
			console.log("Check range", rangeAge);
		}

		//order by
		if (req.query.orderColumn) {
			let orderDirection = req.query.orderDirection || "DESC";
			order = [req.query.orderColumn, orderDirection];
		}

		//push every thing in condition
		if (include && include.length > 0) {
			condition.include = include;
		}
		if (order && order.length > 0) {
			condition.order = [order];
		}
		condition.where = where;
		console.log("codition", condition);
		await Demographics.findAndCountAll(condition)
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

let getDemographicsById = async (req, res, next) => {
	try {
		const id = req.params.id;
		console.log(id);
		let demographicData = await Demographics.findOne({
			where: { id: id },
		});
		if (!demographicData) {
			throw createHttpError(400, "this id isn't exsit");
		} else {
			res.send(createSuccess(demographicData));
		}
	} catch (err) {
		next(err);
	}
};
let updateDemographic = async (req, res, next) => {
	try {
		let { id } = req.body;
		if (!id) {
			throw createHttpError(400, "Missing 'id' field");
		}
		const { error } = demographicsValidator(req.body);
		if (error) throw createHttpError(500, error);

		Demographics.update(req.body, {
			where: {
				id: id,
				isDeleted: false,
			},
		})
			.then(async () => {
				Demographics.findOne({
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

let deleteDemographics = async (req, res, next) => {
	try {
		const id = req.params.id;
		Demographics.update(
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
	createDemographics,
	retrieveAllDemographic,
	deleteDemographics,
	updateDemographic,
	getDemographicsById,
};
