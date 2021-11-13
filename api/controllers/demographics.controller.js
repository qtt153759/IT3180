const db = require("../models");
const Demographics = db.demographics;

// Created and save a new demographics
exports.create = (req, res) => {
	if (!req.body) {
		res.status(400).send({
			message: "body cannot be empty!",
		});
		return;
	}

	const demographics = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		status: req.body.status,
		alias: req.body.alias,
		nation: req.body.nation,
		birth_day: req.body.birth_day,
		birth_place: req.body.birth_place,
		job: req.body.job,
		job_address: req.body.job_address,
		identity_card_number: req.body.identity_card_number,
		identity_card_create_date: req.body.identity_card_create_date,
		identity_card_create_address: req.body.identity_card_create_address,
		register_residence_date: req.body.register_residence_date,
		last_resident_address: req.body.last_resident_address,
		relationship_with_header: req.body.relationship_with_header,
		role: req.body.role,
		status: req.body.status,
	};

	Demographics.create(demographics).then((data, err) => {
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

// Retrieve all demographics from the database
exports.retrieveAll = (req, res) => {
	Demographics.findAll()
		.then((data) => {
			res.send({
				data: data,
			});
		})
		.catch((err) => {
			res.send({
				message:
					err.message ||
					"Some error occurred while retrieving demographics",
			});
		});
};

exports.update = (req, res) => {
	const id = req.params.id;

	// Demographics.update();
};

exports.delete = (req, res) => {
	const id = req.params.id;
	Demographics.delete()
		.then((data) => {
			console.log(data);
		})
		.catch((err) => {
			console.log(err);
		});
};
