const createHttpError = require("http-errors");
const createSuccess = require("../helpers/respose.success");

const Residences = require("../models/residence.model");
const Demographics = require("../models/demographics.model");
const ResidenceHistory = require("../models/residenceHistory.model");

const { logResidenceHistory } = require("../services/residence.service");
const residenceChange = require("../constance/residenceChange");
const relationship = require("../constance/relationship");
// Created and save a new residence
let create = async (req, res, next) => {
	try {
		let { residence_number, provinceId, districtId, wardId } = req.body;
		if (!(provinceId && districtId && wardId && residence_number)) {
			throw createHttpError(400, "body missing field!");
		}
		let existResidence = await Residences.findOne({
			where: { residence_number: residence_number },
		});
		if (existResidence) {
			throw createHttpError(400, "residence_number is already exist");
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

		let where = {
			isDeleted: false,
		};

		if (req.query.number) {
			where.residence_number = req.query.number;
		}

		Residences.findAndCountAll({
			where,
			limit: limit,
			offset: (page - 1) * limit,
			order: [["updatedAt", "DESC"]],
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
		console.log("req body================", req.body);
		let updatedResidence = req.body;

		let residence = await Residences.findOne({
			where: {
				id: id,
				isDeleted: false,
			},

			include: Demographics,
		});

		if (updatedResidence.headerId) {
			const newHeader = await residence.demographics.find(
				(item) =>
					item.id === updatedResidence.headerId && !item.isDeleted
			);

			if (!newHeader)
				throw createHttpError(
					`not found header id ${updatedResidence.headerId} in residence id ${id}`
				);
			console.log("new Header==========", newHeader);
			const OldHeader = await residence.demographics.find(
				(item) => item.relationshipWithHeader === relationship.CHU_HO
			);
			console.log("new Older", OldHeader);
			await Promise.all([
				Demographics.update(
					{
						relationshipWithHeader:
							newHeader.relationshipWithHeader,
					},
					{
						where: {
							id: OldHeader.id,
						},
					}
				),
				Demographics.update(
					{
						relationshipWithHeader: 11,
					},
					{
						where: {
							id: newHeader.id,
						},
					}
				),
			]);
		}

		logResidenceHistory({
			residenceId: id,
			demographicId: updatedResidence.headerId,
			address: updatedResidence.address,
			note: updatedResidence.note,
		});

		if (!residence) {
			throw Error(`Residence not updated. id: ${id}`);
		}

		delete updatedResidence.id;
		delete updatedResidence.demographicId;

		console.log("updatedField", updatedResidence);

		residence.set(updatedResidence);

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
				order: [["updatedAt", "DESC"]],
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
		const change = await ResidenceHistory.findAndCountAll({
			where: { isDeleted: false, residenceId: id },
			order: [["updatedAt", "DESC"]],
		});

		return res.send(createSuccess(change.rows, change.count));
	} catch (err) {
		next(err);
	}
};

let moveDemographics = async (req, res, next) => {
	try {
		const {
			residence_id: oldResidenceId,
			demographic_ids: demographicIds,
			new_header_id: newHeaderId,
			residence_number,
		} = req.body;

		let oldResidence = await Residences.findOne({
			where: { id: oldResidenceId },
			raw: true,
			nest: true,
		});

		if (!oldResidence)
			throw createHttpError(
				400,
				`not found residence id ${oldResidenceId}`
			);

		delete oldResidence.id;
		delete oldResidence.createdAt;
		delete oldResidence.updatedAt;
		delete oldResidence.isDeleted;

		let residence = await Residences.create({
			...oldResidence,
			residence_number,
			headerId: newHeaderId,
		});

		await Demographics.update(
			{
				residenceId: residence.id,
			},
			{
				where: {
					id: demographicIds,
					isDeleted: false,
				},
			}
		);

		await Demographics.update(
			{
				relationshipWithHeader: relationship.CHU_HO,
			},
			{
				where: {
					id: newHeaderId,
					isDeleted: false,
				},
			}
		);

		for (const id in demographicIds) {
			logResidenceHistory({
				residenceId: oldResidenceId,
				demographicId: id,
				type: residenceChange.NHAN_KHAU_CHUYEN_DI,
			});

			logResidenceHistory({
				residenceId: residence.id,
				demographicId: id,
				type: residenceChange.NHAN_KHAU_CHUYEN_DEN,
			});
		}
		res.send(createSuccess());
	} catch (err) {
		next(err);
	}
};

let moveSingleDemographics = async (req, res, next) => {
	try {
		const {
			demographic_id: demographicId,
			to_residence_id: newResidenceId,
		} = req.body;

		let demographic = await Demographics.findOne({
			where: {
				id: demographicId,
			},
		});

		if (demographic.relationshipWithHeader == relationship.CHU_HO) {
			throw createHttpError(400, `${demographicId} is header`);
		}

		if (!demographic)
			throw createHttpError(
				400,
				`not found demographic id ${demographicId}`
			);
		const oldResidenceId = demographic.residenceId;
		demographic.residenceId = newResidenceId;

		await demographic.save();

		logResidenceHistory({
			demographicId,
			residenceId: oldResidenceId,
			type: residenceChange.NHAN_KHAU_CHUYEN_DI,
		});

		logResidenceHistory({
			demographicId,
			residenceId: newResidenceId,
			type: residenceChange.NHAN_KHAU_CHUYEN_DEN,
		});

		return res.send(createSuccess(demographic));
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
	moveSingleDemographics,
};
