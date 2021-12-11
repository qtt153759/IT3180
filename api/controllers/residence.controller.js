const Residence = require("../models/residence.model");

// Created and save a new residence
exports.create = (req, res) => {
	if (!req.body) {
		res.status(400).send({
			message: "body cannot be empty!",
		});
	}

	const residence = {
		headerId: req.body.header_id,
		provinceId: req.body.province_id,
		districtId: req.body.district_id,
		wardId: req.body.ward_id,
		address: req.body.address,
	};

	Residence.create(residence).then((data, err) => {
		if (err) {
			res.status(500).send({
				message:
					err.message ||
					"Some error occurred while creating the Book.",
			});
		}

		res.send(data);
	});
};

// Retrieve all residence record
exports.getAll = (req, res) => {
	Residence.findAll({ where: { isDeleted: false } })
		.then((data) => {
			res.status(200).send({
				data: data,
			});
		})
		.catch((err) => {
			res.status(400).send({
				message: err.message || "Error",
			});
		});
};

exports.update = (req, res) => {
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

exports.delete = (req, res) => {};
