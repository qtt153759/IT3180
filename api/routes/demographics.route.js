const express = require("express");
const route = express.Router();
const demographicsController = require("../controllers/demographics.controller");
const author = require("../middlewares/author");
const role = require("../constance/role");

route.get(
	"/",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	demographicsController.retrieveAllDemographic
);
route.get(
	"/stats",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	demographicsController.getDemographicsStats
);
route.get(
	"/:id",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	demographicsController.getDemographicsById
);
route.post(
	"/",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	demographicsController.createDemographics
);
route.put(
	"/update",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	demographicsController.updateDemographic
);
route.delete(
	"/delete/:id",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	demographicsController.deleteDemographics
);
route.put(
	"/update/status/:id",
	author([role.CAN_BO_HO_KHAU, role.CAN_BO_NHAN_KHAU]),
	demographicsController.updateDemographicStatus
);

route.get("/nation");

module.exports = route;
