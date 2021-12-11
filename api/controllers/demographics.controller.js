const Demographics = require("../models/demographics.model");
const createHttpError = require("http-errors");
const { demographicsValidator } = require("../helpers/validator");

// Created and save a new demographics
let createDemographics = async (req, res, next) => {
	try {
		const { error } = demographicsValidator(req.body);
		if (error) throw createHttpError(500, error);
		let { firstname } = req.body; //destructuring

		const exist = await Demographics.findOne({
			where: {
				firstname,
				isDeleted: false,
			},
		});

		if (exist) {
			throw createHttpError(500, "first name exist");
		}

		Demographics.create(req.body)
			.then((data) => {
				res.send(data);
			})
			.catch((err) => {
				throw createHttpError(500, err);
			});
	} catch (err) {
		next(err);
	}
};

// Retrieve all demographics from the database
let retrieveAllDemographic = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page);
		let limit = parseInt(req.query.limit);
		if (Number.isNaN(page)) {
			page = 1;
		}
		if (Number.isNaN(limit)) {
			limit = 10;
		}
		await Demographics.findAll({
			where: { isDeleted: false },
			limit: limit,
			offset: (page - 1) * limit,
		})
			.then((data) => {
				res.send({
					data,
				});
			})
			.catch((err) => {
				throw createHttpError(500, err);
			});
	} catch (err) {
		next(err);
	}
};

let updateDemographic = async (req, res, next) => {
	try {
		let { id } = req.body;
		if (!id) {
			throw createHttpError(500, "empty id ");
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
						res.send(data);
					})
					.catch((err) => {
						throw createHttpError(500, err);
					});
			})
			.catch((err) => {
				throw createHttpError(500, err);
			});
	} catch (err) {
		next(err);
	}
};

let deleteDemographics = async (req, res, next) => {
	try {
		const id = req.params.id;
		console.log(req.params.id);
		Demographics.update({
			where: {
				id: id,
				isDeleted: true,
			},
		})
			.then((data) => {
				return res.send({
					message: "success",
					data: data,
				});
			})
			.catch((err) => {
				throw createHttpError(500, err);
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
};
