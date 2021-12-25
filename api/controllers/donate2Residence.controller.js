const createHttpError = require("http-errors");
const createSuccess = require("../helpers/respose.success");
const Donate = require("../models/donate.model");
const Donate2Residence = require("../models/donate2Residence.model");
const Residence = require("../models/residence.model");
const { Sequelize } = require("sequelize");
const Demographics = require("../models/demographics.model");
let getAllDonate2Residence = async (req, res, next) => {
	try {
		console.log("vao controller");
		await Donate2Residence.findAll({
			where: { isDeleted: false },
			include: [
				{
					model: Donate,
					as: "donate",
					attributes: ["name", "description", "fee", "type", "unit"],
					required: true,
				},
			],
		})
			.then((data) => {
				res.send(createSuccess(data));
			})
			.catch((err) => {
				next(createHttpError(500, err));
			});
	} catch (err) {
		next(err);
	}
};
let getDonate2ResidenceByResidence = async (req, res, next) => {
	try {
		if (!req.params.id) {
			throw createHttpError(400, "params missing residence_id!");
		}
		let id = req.params.id;
		await Donate2Residence.findAll({
			where: { residence_id: id, isDeleted: false },
			include: [
				{
					model: Donate,
					as: "donate",
					attributes: ["name", "description"],
					required: true,
				},
			],
		})
			.then((data) => {
				res.send(createSuccess(data));
			})
			.catch((err) => {
				next(createHttpError(500, err));
			});
	} catch (err) {
		next(err);
	}
};
let getDonate2ResidenceByDonate = async (req, res, next) => {
	try {
		if (!req.params.id) {
			throw createHttpError(400, "params missing residence_id!");
		}
		let id = req.params.id;
		await Donate2Residence.findAll({
			where: { donate_id: id, isDeleted: false },
			include: [
				{
					model: Donate,
					as: "donate",
					attributes: ["name", "description"],
					required: true,
				},
			],
		})
			.then((data) => {
				res.send(createSuccess(data));
			})
			.catch((err) => {
				next(createHttpError(500, err));
			});
	} catch (err) {
		next(err);
	}
};
let getStatsById = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let { id } = req.params;
		Donate2Residence.findAll({
			where: { isDeleted: false, donate_id: id },
			limit: limit,
			offset: (page - 1) * limit,
			attributes: [
				"donate_id",
				[
					Sequelize.fn("COUNT", Sequelize.col("residence_id")),
					"countResidence",
				],
				[Sequelize.fn("SUM", Sequelize.col("money")), "sumMoney"],
				[Sequelize.fn("MAX", Sequelize.col("money")), "maxMoney"],
			],
			include: [
				{
					model: Donate,
					as: "donate",
				},
			],
			raw: true,
			nest: true,
		})
			.then(async (data) => {
				let maxResidence = await Donate2Residence.findOne({
					where: {
						donate_id: id,
						money: data[0].maxMoney,
						isDeleted: false,
					},
					raw: true,
					nest: true,
				});
				data[0] = { ...data[0], maxResidence };
				res.send(data[0]);
			})
			.catch((err) => {
				next(createHttpError(500, err));
			});
	} catch (err) {
		next(err);
	}
};
let createDonate2Residence = async (req, res, next) => {
	try {
		// chắc chắn phải có 3 trường này
		let { donate_id, residence_id } = req.body;
		if (!req.body || !donate_id || !residence_id) {
			throw createHttpError(400, "body missing field!");
		}
		let money = req.body.money || 0;
		//Check xem có trùng ko
		const exist = await Donate2Residence.findOne({
			where: {
				donate_id: req.body.donate_id,
				residence_id: residence_id,
				isDeleted: false,
			},
		});
		if (exist)
			throw createHttpError(
				400,
				"Dupicate both donate_id and residence_id"
			);
		//check xem có hộ đấy ko
		const residenceExist = await Residence.findOne({
			where: { id: residence_id, isDeleted: false },
		});
		if (!residenceExist) {
			throw createHttpError(400, "residence is not Exist!");
		}
		//check xem có khoản phí đó không
		const donateExist = await Donate.findOne({
			where: { id: donate_id, isDeleted: false },
		});
		if (!donateExist) {
			throw createHttpError(400, "donate is not Exist!");
		}
		//Nếu các điều kiện trên ok thì sẽ xét xem nó là phí hay donate
		if (donateExist.type === 2) {
			//phí
			let { fee, unit } = donateExist;
			//xét xem đóng theo hộ hay người
			if (unit === 2) {
				//nếu theo người thì tính số người trong hộ đó
				let residence_Number = await Demographics.findAndCountAll({
					where: {
						residence_id: residence_id,
						isDeleted: false,
					},
				});
				//số tiền bằng tích fee và số người trong hộ
				money = fee * residence_Number.count;
				console.log("residence_Number", residence_Number);
			} else if (unit === 1) {
				//nếu theo hộ thì lấy luôn số fee làm tiền đóng money
				money = fee;
			}
		}
		//nếu là donate thì phải check xem tiền có âm không
		else if (donateExist.type === 1) {
			if (!req.body.money) {
				throw createHttpError(400, "missing money when donate");
			} else if (req.body.money <= 0) {
				throw createHttpError(400, "money must be positive");
			}
		}

		const data = await Donate2Residence.create({
			donate_id: donate_id,
			residence_id: residence_id,
			money: money,
		});

		return res.send(createSuccess(data));
	} catch (err) {
		next(err);
	}
};
let updateDonate2Residence = async (req, res, next) => {
	try {
		// chắc chắn phải có 3 trường này
		let { id, donate_id, residence_id } = req.body;
		if (!req.body || !id || !donate_id || !residence_id) {
			throw createHttpError(400, "body missing field!");
		}
		let money = req.body.money || 0;

		//check xem có hộ đấy ko
		const residenceExist = await Residence.findOne({
			where: { id: residence_id, isDeleted: false },
		});
		if (!residenceExist) {
			throw createHttpError(400, "residence is not Exist!");
		}
		//check xem có khoản phí đó không
		const donateExist = await Donate.findOne({
			where: { id: donate_id, isDeleted: false },
		});
		if (!donateExist) {
			throw createHttpError(400, "donate is not Exist!");
		}
		//Nếu các điều kiện trên ok thì sẽ xét xem nó là phí hay donate
		if (donateExist.type === 2) {
			//phí
			let { fee, unit } = donateExist;
			//xét xem đóng theo hộ hay người
			if (unit === 2) {
				//nếu theo người thì tính số người trong hộ đó
				let residence_Number = await Demographics.findAndCountAll({
					where: {
						residence_id: residence_id,
						isDeleted: false,
					},
				});
				//số tiền bằng tích fee và số người trong hộ
				money = fee * residence_Number.count;
				console.log("residence_Number", residence_Number);
			} else if (unit === 1) {
				//nếu theo hộ thì lấy luôn số fee làm tiền đóng money
				money = fee;
			}
		}
		//nếu là donate thì phải check xem tiền có âm không
		else if (donateExist.type === 1) {
			if (!req.body.money) {
				throw createHttpError(400, "missing money when donate");
			} else if (req.body.money <= 0) {
				throw createHttpError(400, "money must be positive");
			}
		}

		Donate2Residence.update(
			{
				donate_id: donate_id,
				residence_id: residence_id,
				money: money,
			},
			{
				where: {
					id: id,
					isDeleted: false,
				},
			}
		)
			.then(async () => {
				let data = await Donate2Residence.findOne({
					where: { id },
				});
				if (data) {
					return res.send(createSuccess(data));
				} else {
					throw createHttpError(400, "error");
				}
			})
			.catch((err) => {
				next(createHttpError(500, err));
			});
	} catch (err) {
		next(err);
	}
};

let deleteDonate2Residence = async (req, res, next) => {
	try {
		const id = req.params.id;
		Donate2Residence.update(
			{
				isDeleted: true,
			},
			{
				where: {
					id,
					isDeleted: false,
				},
				returning: true,
				plain: true,
			}
		)
			.then((data) => {
				return res.send(createSuccess());
			})
			.catch((err) => {
				throw err;
			});
	} catch (err) {
		next(err);
	}
};
let getStats = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;

		Donate2Residence.findAndCountAll({
			where: { isDeleted: false },
			limit: limit,
			offset: (page - 1) * limit,
			attributes: [
				"donate_id",
				[
					Sequelize.fn("COUNT", Sequelize.col("residence_id")),
					"Số lượng họ đóng góp",
				],
				[
					Sequelize.fn("SUM", Sequelize.col("money")),
					"Số tiền đóng góp",
				],
				[
					Sequelize.fn("MAX", Sequelize.col("money")),
					"Số tiền đóng góp lớn nhất từ một hộ ",
				],
			],
			include: [
				{
					model: Donate,
					as: "donate",
				},
			],
			group: ["donate_id"],
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
module.exports = {
	getDonate2ResidenceByResidence,
	getAllDonate2Residence,
	createDonate2Residence,
	updateDonate2Residence,
	deleteDonate2Residence,
	getDonate2ResidenceByDonate,
	getStats,
	getStatsById,
};
