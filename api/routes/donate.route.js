const express = require("express");

const donateController = require("../controllers/donate.controller");
const route = express.Router();
const author = require("../middlewares/author");
const role = require("../constance/role");

route.get("/", donateController.getDonate);
route.get(
	"/:id",
	author([role.CAN_BO_THU_PHI]),
	donateController.getDonateById
);
route.post("/", author([role.CAN_BO_THU_PHI]), donateController.createDonate);
route.put(
	"/update",
	author([role.CAN_BO_THU_PHI]),
	donateController.updateDonate
);
route.delete(
	"/delete/:id",
	author([role.CAN_BO_THU_PHI]),
	donateController.deleteDonate
);

module.exports = route;
