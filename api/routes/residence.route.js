const express = require("express");
const route = express.Router();
const residenceController = require("../controllers/residence.controller");
const authen = require("../middlewares/authen");
const author = require("../middlewares/author");
const role = require("../constance/role");

// get thay đổi của hộ khẩu
route.get(
	"/change/:id",
	authen,
	author([role.CAN_BO_1]),
	residenceController.getResidenceChange
);

route.get("/", residenceController.getAll);
route.get("/:id", residenceController.getResidenceById);
route.post("/", residenceController.create);
route.put("/update", residenceController.updateResidence);
route.delete("/delete/:id", residenceController.deleteResidence);

// Lấy danh sách nhân khẩu trong hộ khẩu
route.get("/:id/demographics", residenceController.getDemographicsInResidence);

// get thay đổi của hộ khẩu
route.get("/change", residenceController.getResidenceChange);

route.post("/move", residenceController.moveDemographics);
route.post("/move-single", residenceController.moveSingleDemographics);

module.exports = route;
