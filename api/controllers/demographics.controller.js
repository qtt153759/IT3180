const Demographics = require("../models/demographics.model");
const createHttpError = require("http-errors");

// Created and save a new demographics
exports.create = async (req, res, next) => {
	try {
		if (!req.body) {
			res.status(400).send({
				message: "body cannot be empty!",
			});
			return;
		}

		let { first_name } = req.body;

		const exist = await Demographics.findOne({
			where: {
				firstname: first_name,
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
exports.retrieveAll = (req, res, next) => {
	try {
		Demographics.findAll({ where: { isDeleted: false } })
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

exports.update = (req, res, next) => {
	try {
		let { user_id: userId, firstname, lastname } = req.body;

		let updateField = {};
		if (firstname) updateField.firstname = firstname;
		if (lastname) updateField.lastname = req.body.lastname;

		Demographics.update(updateField, {
			where: {
				id: userId,
				isDeleted: false,
			},
		})
			.then(async (_) => {
				Demographics.findOne({
					id: userId,
				})
					.then((data) => {
						res.send({
							data: demographicsInfo,
						});
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

exports.delete = (req, res, next) => {
	try {
		const id = req.params.id;
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
