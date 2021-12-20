const Demographics = require("../models/demographics.model");
const createHttpError = require("http-errors");
const { demographicsValidator } = require("../helpers/validator");
const createSuccess = require("../helpers/respose.success");

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
			throw createHttpError(400, "first name exist");
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

		await Demographics.findAll({
			where: { isDeleted: false },
			limit: limit,
			offset: (page - 1) * limit,
		})
			.then((data) => {
				res.send(createSuccess(data, data.length));
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
			.then(async (_) => {
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
		const exist = await Demographics.findOne({
			where: { id, isDeleted: false },
		});

		if (!exist) throw createHttpError(400, "id not found");

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
	createDemographics,
	retrieveAllDemographic,
	deleteDemographics,
	updateDemographic,
	getDemographicsById,
};
