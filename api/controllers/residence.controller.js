const createHttpError = require("http-errors");
const createSuccess = require("../helpers/respose.success");

const Residences = require("../models/residence.model");
const Demographics = require("../models/demographics.model");
const ResidenceHistory = require("../models/residenceHistory.model");

// Created and save a new residence
let create = async (req, res, next) => {
	try {
		let { provinceId, districtId, wardId } = req.body;
		if (!(provinceId && districtId && wardId)) {
			throw createHttpError(400, "body missing field!");
		}

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

		Residences.findAndCountAll({
			where: { isDeleted: false },
			limit: limit,
			offset: (page - 1) * limit,
		})
			.then((data) => {
				res.send(createSuccess(data.rows, data.count, page, limit));
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

let updateResidence = async (req, res, next) => {
	try {
		if (!req.body)
			return res.send({
				message: "empty body",
			});

		let id = req.body.id;

		let updatedField = req.body;

		let residence = await Residences.findOne({
			where: {
				id,
				isDeleted: false,
			},
		});

		if (!residence) {
			throw Error(`Residence not updated. id: ${id}`);
		}

		residence = updatedField;
		await residence.save();

		res.send(createSuccess(residence));
	} catch (err) {
		next(err);
	}
};

let deleteResidence = async (req, res, next) => {
	try {
		if (!req.params.id) throw createHttpError(400, "id not found");

		const residence = await Residences.findOne({
			where: {
				id: req.params.id,
				isDeleted: false,
			},
		});

		if (!residence) throw createHttpError(400, "residence not found");

		residence.isDeleted = true;

		await residence.save();

		return res.send(createSuccess(residence));
	} catch (err) {
		next(err);
	}
};

let getDemographicsInResidence = async (req, res, next) => {
	try {
		const id = req.params.id;

		let [demographics, residence] = await Promise.all([
			Demographics.findAll({
				where: { residenceId: id },
			}),
			Residences.findOne({
				where: { id },
			}),
		]);

		residence.setDataValue("demographics", demographics);

		return res.send(createSuccess(residence));
	} catch (err) {
		next(err);
	}
};

let getResidenceChange = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id) throw createHttpError(400, "id not found");
		const residenceChange = await ResidenceHistory.findAndCountAll({
			where: { isDeleted: false, residenceId: id },
		});

		return res.send(
			createSuccess(residenceChange.rows, residenceChange.count)
		);
	} catch (err) {
		next(err);
	}
};

let moveDemographics = async (req, res, next) => {
	try {
		const {
			residence_id: residenceId,
			demographic_ids: demographicIds,
			new_header_id: newHeaderId,
			residence_number,
		} = req.body;

		const demographics = await Demographics.findAll({
			where: {
				residenceId,
			},
			include: Residences,
		});

		let residence = await Residences.create({
			...demographics.residence,
			residence_number,
			headerId: newHeaderId,
		});

		await Promise.all(
			demographics
				.filter((item) => demographicIds.includes(item.id))
				.map(async (item) => {
					item.residence_id = residence.id;
					await item.save();
				})
		);

		const id = demographics.residence?.headerId;
		console.log(id);

		res.send(createSuccess());
	} catch (err) {
		next(err);
	}
};

module.exports = {
	create,
	getAll,
	updateResidence,
	deleteResidence,
	getResidenceById,
	getDemographicsInResidence,
	getResidenceChange,
	moveDemographics,
};
