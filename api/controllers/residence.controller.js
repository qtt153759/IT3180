const db = require("../models");
const Residence = db.residence;

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
	Residence.findAll()
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
