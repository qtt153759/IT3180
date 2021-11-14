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
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		status: req.body.status,
		alias: req.body.alias,
		nation: req.body.nation,
		birthday: req.body.birthday,
		birthPlace: req.body.birth_place,
		job: req.body.job,
		jobAddress: req.body.job_address,
		identityCardNumber: req.body.identity_card_number,
		identityCardCreateDate: req.body.identity_card_create_date,
		identityCardCreateAddress: req.body.identity_card_create_address,
		registerResidenceDate: req.body.register_residence_date,
		lastResidentAddress: req.body.last_resident_address,
		relationshipWithHeader: req.body.relationship_with_header,
		role: req.body.role,
		status: req.body.status,
	};

	Demographics.create(demographics)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message ||
					"Some error occurred while creating the Book.",
			});
		});
};

// Retrieve all demographics from the database
exports.retrieveAll = (req, res) => {
	Demographics.findAll({ where: { isDeleted: false } })
		.then((data) => {
			return res.send({
				data: data,
			});
		})
		.catch((err) => {
			return res.send({
				message:
					err.message ||
					"Some error occurred while retrieving demographics",
			});
		});
};

exports.update = (req, res) => {
	let userId = req.body.user_id;
	let firstName = req.body.firstname;
	let lastName = req.body.lastname;

	console.log(userId, firstName, lastName);

	let updateField = {};
	if (firstName) updateField.firstname = req.body.firstname;
	if (lastName) updateField.lastname = req.body.lastname;

	Demographics.update(updateField, {
		where: {
			id: userId,
		},
	})
		.then(async (_) => {
			let demographicsInfo = await Demographics.findOne({ id: userId });

			return res.send({
				message: "update success",
				data: demographicsInfo,
			});
		})
		.catch((err) => {
			return res.send({
				message: err || "update fail",
			});
		});
};

exports.delete = (req, res) => {
	const id = req.params.id;
	Demographics.update(
		{
			isDeleted: true,
		},
		{
			where: {
				id: id,
			},
		}
	)
		.then((data) => {
			return res.send({
				message: "delete success",
				data: data,
			});
		})
		.catch((err) => {
			return res.send({
				message: err || "delete false",
			});
		});
};
