const Residences = require("../models/residence.model");
const createHttpError = require("http-errors");
const createSuccess = require("../helpers/respose.success");

// Created and save a new residence
let create = async (req, res, next) => {
	try {
		let { headerId, provinceId, districtId, wardId } = req.body;
		if (!(headerId && provinceId && districtId && wardId)) {
			throw createHttpError(400, "body missing field!");
		}

		const exist = await Residences.findOne({
			where: { headerId: headerId, isDeleted: false },
		});
		console.log(headerId);
		if (exist) throw createHttpError(400, "Dupicate header_id");

		const data = await Residences.create(req.body);

		return res.send(createSuccess(data));
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
				res.send(createSuccess(data, data.length, page, limit));
			})
			.catch((err) => {
				next(createHttpError(500, err));
			});
	} catch (err) {
		next(err);
	}
};
let getResidenceById = async (req, res, next) => {
	try {
		const id = req.params.id;
		let redidenceData = await Residences.findOne({
			where: { id: id },
		});
		if (!redidenceData) {
			throw createHttpError(400, "this id isn't exsit");
		} else {
			res.send(createSuccess(redidenceData));
		}
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

	Residences.update(updatedField, {
		where: {
			id: id,
			isDeleted: false,
		},
	});
};

let deleteResidence = async (req, res, next) => {
	try {
		const id = req.params.id;

		const exist = await Residences.findOne({
			where: { id, isDeleted: false },
		});

		if (!exist) throw createHttpError(400, "id not found");
		await Residences.update(
			{ isDeleted: true },
			{ where: { id, isDeleted: false } }
		);

		return res.send(createSuccess());
	} catch (err) {
		next(err);
	}
};

module.exports = {
	create,
	getAll,
	update,
	deleteResidence,
	getResidenceById,
};
