const express = require("express");
const author = require("../middlewares/author");
const role = require("../constance/role");

const donate2ResidenceStatsController = require("../controllers/donate2ResidenceStats.controller");
const route = express.Router();

route.get(
	"/donate",
	author([role.CAN_BO_THU_PHI, role.CAN_BO_HO_KHAU]),
	donate2ResidenceStatsController.getDonateStats
);
route.get(
	"/donate/:id",
	author([role.CAN_BO_THU_PHI, role.CAN_BO_HO_KHAU]),
	donate2ResidenceStatsController.getDonateStatsById
);
route.get(
	"/residence/:id",
	author([role.CAN_BO_THU_PHI, role.CAN_BO_HO_KHAU]),
	donate2ResidenceStatsController.getResidenceStatsById
);
route.get(
	"/residence",
	author([role.CAN_BO_THU_PHI, role.CAN_BO_HO_KHAU]),
	donate2ResidenceStatsController.getResidenceStats
);

module.exports = route;
