const express = require("express");

const absentStayController = require("../controllers/absentStay.controller");
const route = express.Router();

const author = require("../middlewares/author");
const role = require("../constance/role");

route.get(
	"/",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	absentStayController.getAllStayAbsent
);
route.get(
	"/:id",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	absentStayController.getStayAbsentById
);
route.post(
	"/",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	absentStayController.createAbsentStay
);

module.exports = route;
