const createHttpError = require("http-errors");
const createSuccess = require("../helpers/respose.success");
const Donate = require("../models/donate.model");
const Donate2Residence = require("../models/donate2Residence.model");
const Residence = require("../models/residence.model");
const { Sequelize, Op } = require("sequelize");
const Demographics = require("../models/demographics.model");
let getAllDonate2Residence = async (req, res, next) => {
	try {
		let condition = { isDeleted: false };
		let idList = [];
		if (req.query && req.query.type) {
			let conditionDonate = { isDeleted: false };
			console.log("type", req.query.type);
			if (+req.query.type === 1) {
				conditionDonate = { type: 1 };
			} else {
				conditionDonate = { type: 2 };
			}
			let donate = await Donate.findAll({
				where: conditionDonate,
				raw: true,
			});
			for (let i = 0; i < donate.length; i++) {
				idList.push(donate[i].id);
			}
			console.log("condition", idList);
			condition.donate_id = { [Op.in]: idList };
		}
		await Donate2Residence.findAll({
			where: condition,
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
let getResidenceByDonate = async (req, res, next) => {
	try {
		if (!req.params.id) {
			throw createHttpError(400, "params missing donate!");
		}
		let id = req.params.id;
		let condition = { isDeleted: false };
		let idList = [];
		let data;
		let donate2Residence = await Donate2Residence.findAll({
			where: { donate_id: id, isDeleted: false },
			raw: true,
		});
		for (let i = 0; i < donate2Residence.length; i++) {
			idList.push(donate2Residence[i].residence_id);
		}
		console.log("idlist", idList);
		if (+req.query.type === 2) {
			condition = { id: { [Op.notIn]: idList } };
			data = await Residence.findAndCountAll({
				where: condition,
			});
		} else {
			condition = { id: { [Op.in]: idList } };
			data = await Residence.findAndCountAll({
				where: condition,
			});
		}
		res.send(createSuccess(data.rows, data.count));
	} catch (err) {
		next(err);
	}
};
let getDonate2ResidenceByDonate = async (req, res, next) => {
	try {
		if (!req.params.id) {
			throw createHttpError(400, "params missing donate!");
		}
		let id = req.params.id;
		let condition = { isDeleted: false };
		if (+req.query.type === 2) {
			condition = { donate_id: { [Op.ne]: id } };
		} else {
			condition = { donate_id: id };
		}
		await Donate2Residence.findAll({
			where: condition,
			include: [
				{
					model: Donate,
					as: "donate",
					attributes: ["name", "description", "type", "fee", "unit"],
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
let createDonate2Residence = async (req, res, next) => {
	try {
		// chắc chắn phải có 3 trường này
		console.log("==================");
		console.log("req body", req.body);
		let { donate_id, residence_number } = req.body;
		if (!req.body || !donate_id || !residence_number) {
			throw createHttpError(400, "body missing field!");
		}
		let money = req.body.money || 0;
		//check xem có hộ đấy ko
		const residenceExist = await Residence.findOne({
			where: { residence_number: residence_number, isDeleted: false },
		});
		if (!residenceExist) {
			throw createHttpError(
				400,
				"residence is not Exist vs cái number này!"
			);
		}
		let residence_id = residenceExist.id;
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
				let residence_AllNumber = await Demographics.findAndCountAll({
					where: {
						residence_id: residence_id,
						isDeleted: false,
					},
				});
				//số tiền bằng tích fee và số người trong hộ
				money = fee * residence_AllNumber.count;
				console.log("residence_Number", residence_AllNumber);
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
		let { id, donate_id, residence_number } = req.body;
		if (!req.body || !id || !donate_id || !residence_number) {
			throw createHttpError(400, "body missing field!");
		}
		let money = req.body.money || 0;

		//check xem có hộ đấy ko
		const residenceExist = await Residence.findOne({
			where: { residence_number: residence_number, isDeleted: false },
		});
		if (!residenceExist) {
			throw createHttpError(400, "residence is not Exist!");
		}
		let residence_id = residenceExist.id;
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
				let residence_AllNumber = await Demographics.findAndCountAll({
					where: {
						residence_id: residence_id,
						isDeleted: false,
					},
				});
				//số tiền bằng tích fee và số người trong hộ
				money = fee * residence_AllNumber.count;
				console.log("residence_Number", residence_AllNumber);
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
		if (req.params.id) {
			throw createHttpError(400, "Missing id");
		}
		let id = req.params.id;
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

module.exports = {
	getDonate2ResidenceByResidence,
	getAllDonate2Residence,
	createDonate2Residence,
	updateDonate2Residence,
	deleteDonate2Residence,
	getDonate2ResidenceByDonate,
	getResidenceByDonate,
};
