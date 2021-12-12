const Residences = require("../models/residence.model");
const createHttpError = require("http-errors");
// Created and save a new residence
let create = async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).send({
				message: "body cannot be empty!",
			});
		}
		Residences.create(req.body)
			.then((data) => {
				return res.send(data);
			})
			.catch((err) => {
				throw createHttpError(500, err);
			});
	} catch (err) {
		next(err);
	}
};

// Retrieve all residence record
let getAll = (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;

		Residences.findAll({
			where: { isDeleted: false },
			limit: limit,
			offset: (page - 1) * limit,
		})
			.then((data) => {
				res.status(200).send({
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

let update = (req, res) => {
	if (!req.body)
		return res.send({
			message: "empty body",
		});

	let updatedField = {};

	let id = req.body.id;
	if (req.body.header_id) updatedField.headerId = req.body.header_id;
	if (req.body.province_id) updatedField.provinceId = req.body.province_id;
	if (req.body.district_id) updatedField.districtId = req.body.district_id;
	if (req.body.ward_id) updatedField.wardId = req.body.ward_id;
	if (req.body.address) updatedField.address = req.body.address;

	Residence.update(updatedField, {
		where: {
			id: id,
			isDeleted: false,
		},
	});
};

let deleteResidence = (req, res) => {};

module.exports = {
	create,
	getAll,
	update,
	deleteResidence,
};
