const express = require("express");
const route = express.Router();
const residenceController = require("../controllers/residence.controller");
const author = require("../middlewares/author");
const role = require("../constance/role");

// get thay đổi của hộ khẩu
route.get(
	"/change/:id",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	residenceController.getResidenceChange
);

route.get(
	"/",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	residenceController.getAll
);
route.get(
	"/:id",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	residenceController.getResidenceById
);
route.post("/", author([role.CAN_BO_HO_KHAU]), residenceController.create);
route.put(
	"/update",
	author([role.CAN_BO_HO_KHAU]),
	residenceController.updateResidence
);
route.delete(
	"/delete/:id",
	author([role.CAN_BO_HO_KHAU]),
	residenceController.deleteResidence
);

// Lấy danh sách nhân khẩu trong hộ khẩu
route.get(
	"/:id/demographics",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	residenceController.getDemographicsInResidence
);

// get thay đổi của hộ khẩu
route.get(
	"/change",
	author([role.CAN_BO_HO_KHAU]),
	residenceController.getResidenceChange
);

route.post(
	"/move",
	author([role.CAN_BO_HO_KHAU]),
	residenceController.moveDemographics
);
route.post(
	"/move-single",
	author([role.CAN_BO_HO_KHAU]),
	residenceController.moveSingleDemographics
);

module.exports = route;
