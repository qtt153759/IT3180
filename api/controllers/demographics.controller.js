const createHttpError = require("http-errors");
const { demographicsValidator } = require("../helpers/validator");
const createSuccess = require("../helpers/respose.success");
const { Op } = require("sequelize");

const demographicsService = require("../services/demographic.service");
const { logResidenceHistory } = require("../services/residence.service");
const Demographics = require("../models/demographics.model");
const Residences = require("../models/residence.model");

// Created and save a new demographics
let createDemographics = async (req, res, next) => {
	try {
		const { error } = demographicsValidator(req.body);
		if (error) throw createHttpError(500, error.details[0].message);
		let { firstname, lastname, residenceId, relationshipWithHeader } =
			req.body;

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

		req.body.residenceId = residenceId;

		let demographic = await Demographics.create(req.body);

		if (relationshipWithHeader == 11) {
			let residence = await Residences.findOne({
				where: {
					id: residenceId,
				},
			});

			if (residence.headerId) {
				demographic.isDeleted = true;
				demographic.save();
				throw createHttpError(
					500,
					`residence id ${residence.id} already had headerId ${residence.headerId}`
				);
			} else {
				residence.headerId = residence.id;
				residence.save();
			}
		}

		return res.send(createSuccess(demographic));
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
		if (req.query.gender) {
			let arrGender = req.query.gender.split(",");

			let conditionGender = [];
			for (let gender of arrGender) {
				conditionGender.push(+gender);
			}
			where.genderId = conditionGender;
		}
		//create where clause
		if (req.query.age) {
			let arrAge = req.query.age.split(",");
			let conditionAge = [];
			for (let age of arrAge) {
				let rangeAge = await demographicsService.checkAge(age);
				let object = {
					[Op.between]: [
						new Date(
							new Date() -
								24 * 60 * 60 * 1000 * 365 * rangeAge.upper
						),
						new Date(
							new Date() -
								24 * 60 * 60 * 1000 * 365 * rangeAge.lower
						),
					],
				};
				conditionAge.push(object);
			}
			where.birthday = {
				[Op.or]: conditionAge,
			};
		}
		if (req.query.name) {
			where = {
				...where,
				[Op.or]: [
					{
						firstname: {
							[Op.like]: `%${req.query.name}%`,
						},
					},
					{
						lastname: {
							[Op.like]: `%${req.query.name}%`,
						},
					},
				],
			};
		}
		//order by
		if (req.query.orderColumn) {
			let orderDirection = req.query.orderDirection || "DESC";
			order = [req.query.orderColumn, orderDirection];
		}
		//push every thing in condition (nation,role,header)
		if (include && include.length > 0) {
			condition.include = include;
		}
		if (order && order.length > 0) {
			condition.order = [order];
		}
		condition.where = where;
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
let getDemographicsStats = async (req, res, next) => {
	try {
		let gender = {};
		gender.male = await Demographics.count({
			where: { genderId: 1, isDeleted: false, isDead: false },
		});
		gender.female = await Demographics.count({
			where: { genderId: 2, isDeleted: false, isDead: false },
		});
		let active = await Demographics.count({
			where: { isDeleted: false, isDead: false },
		});

		let age = {};
		let arrAge = [
			"Infant",
			"Kindergarten",
			"Primary-School",
			"Secondary-School",
			"High-School",
			"Adult",
			"Older",
		];
		for (let i = 0; i < arrAge.length; i++) {
			let rangeAge = await demographicsService.checkAge(arrAge[i]);
			age[arrAge[i]] = await Demographics.count({
				where: {
					birthday: {
						[Op.between]: [
							new Date(
								new Date() -
									24 * 60 * 60 * 1000 * 365 * rangeAge.upper
							),
							new Date(
								new Date() -
									24 * 60 * 60 * 1000 * 365 * rangeAge.lower
							),
						],
					},
					isDeleted: false,
					isDead: false,
				},
			});
		}
		let stats = {
			gender: gender,
			age: age,
			active: active,
		};
		res.send(createSuccess(stats));
	} catch (err) {
		next(err);
	}
};

// cập nhật thông tin cơ bản của nhân khẩu (không liên quan đến hộ khẩu)
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

let updateDemographicStatus = async (req, res, next) => {
	try {
		if (!req.params.id) {
			throw createHttpError(400, "missing demographics id");
		}

		if (!req.body.status) {
			throw createHttpError(400, "missing body status");
		}

		const id = req.params.id;
		const status = req.body.status;

		const demographic = await Demographics.findOne({ where: { id } });

		if (!demographic) {
			throw createHttpError(400, `id: ${id} doesnot exist`);
		}

		const oldStatus = demographic.status;

		demographic.status = status;
		await demographic.save();

		if (oldStatus != status) {
			await logResidenceHistory({
				fromType: oldStatus,
				toType: status,
				demographicId: demographic.id,
				residenceId: demographic.residenceId,
			});
		}

		return res.send(createSuccess(demographic));
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
	getDemographicsStats,
	updateDemographicStatus,
};
