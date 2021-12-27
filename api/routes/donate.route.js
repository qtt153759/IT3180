const express = require("express");

const donateController = require("../controllers/donate.controller");
const route = express.Router();
const author = require("../middlewares/author");
const role = require("../constance/role");

route.get(
	"/",
	author([role.CAN_BO_THU_PHI, role.CAN_BO_HO_KHAU]),
	donateController.getDonate
);
route.get(
	"/:id",
	author([role.CAN_BO_THU_PHI, role.CAN_BO_HO_KHAU]),
	donateController.getDonateById
);
route.post(
	"/",
	author([role.CAN_BO_THU_PHI, role.CAN_BO_HO_KHAU]),
	donateController.createDonate
);
route.put(
	"/update",
	author([role.CAN_BO_THU_PHI, role.CAN_BO_HO_KHAU]),
	donateController.updateDonate
);
route.delete(
	"/delete/:id",
	author([role.CAN_BO_THU_PHI, role.CAN_BO_HO_KHAU]),
	donateController.deleteDonate
);

module.exports = route;
