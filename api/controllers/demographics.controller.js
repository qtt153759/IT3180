const Demographics = require("../models/demographics.model");
const createHttpError = require("http-errors");
const {demographicsValidator}=require("../helpers/validator");

// Created and save a new demographics
let createDemographics =async (req, res, next) => {
	try {
		const{error}=demographicsValidator(req.body);
		if(error)return res.status(400).send(error.details[0].message);
		let { first_name } = req.body;

		const exist = await Demographics.findOne({
			where: {
				firstname: req.body.firstname,
				isDeleted: false,
			},
		});

		if (exist) {
			throw createHttpError(500, "fist_name exist");
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
let retrieveAllDemographic = async(req, res, next) => {
	try {
		await Demographics.findAll({ where: { isDeleted: false } })
			.then((data) => {
				res.send({
					data: data,
				});
			})
			.catch((err) => {
				throw createHttpError.BadRequest(500, err);
			});
	} catch (err) {
		next(err);
	}
};

let updateDemographic =async (req, res) => {
	try {
		if (!req.body.id) {
			res.status(400).send({
				message: "you don't have id",
			});
			return;
			//throw createHttpError(500, "empty");
		}
		const{error}=demographicsValidator(req.body);
		if(error)return res.status(400).send(error.details[0].message);

		
		Demographics.update(req.body, {
			where: {
				id: req.body.id,
				isDeleted: false,
			},
		})
			.then(async (_) => {
				Demographics.findOne({
					id: req.body.id,
				})
					.then((data) => {
						res.send(data)
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

let deleteDemographics = async(req, res, next) => {
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
module.exports={
	createDemographics:createDemographics,
	retrieveAllDemographic:retrieveAllDemographic,
	deleteDemographics:deleteDemographics,
	updateDemographic:updateDemographic
}