const express = require("express");

const donate2ResidenceController = require("../controllers/donate2Residence.controller");
const route = express.Router();

const author = require("../middlewares/author");
const role = require("../constance/role");

route.get("/", donate2ResidenceController.getAllDonate2Residence);
route.get(
	"/byResidence/:id",
	author([role.CAN_BO_THU_PHI, role.CAN_BO_HO_KHAU]),

	donate2ResidenceController.getDonate2ResidenceByResidence
);
route.get(
	"/byDonate/:id",
	author([role.CAN_BO_THU_PHI, role.CAN_BO_HO_KHAU]),

	donate2ResidenceController.getDonate2ResidenceByDonate
);
route.get(
	"/residenceByDonate/:id",
	author([role.CAN_BO_THU_PHI, role.CAN_BO_HO_KHAU]),

	donate2ResidenceController.getResidenceByDonate
);
route.post(
	"/",
	author([role.CAN_BO_THU_PHI]),
	donate2ResidenceController.createDonate2Residence
);
route.put(
	"/update",
	author([role.CAN_BO_THU_PHI]),
	donate2ResidenceController.updateDonate2Residence
);
route.delete(
	"/delete/:id",
	author([role.CAN_BO_THU_PHI]),
	donate2ResidenceController.deleteDonate2Residence
);

module.exports = route;
