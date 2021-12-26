const express = require("express");

const donate2ResidenceController = require("../controllers/donate2Residence.controller");
const route = express.Router();

route.get("/", donate2ResidenceController.getAllDonate2Residence);
route.get(
	"/byResidence/:id",
	donate2ResidenceController.getDonate2ResidenceByResidence
);
route.get(
	"/byDonate/:id",
	donate2ResidenceController.getDonate2ResidenceByDonate
);
route.get(
	"/residenceByDonate/:id",
	donate2ResidenceController.getResidenceByDonate
);
route.post("/", donate2ResidenceController.createDonate2Residence);
route.put("/update", donate2ResidenceController.updateDonate2Residence);
route.delete("/delete/:id", donate2ResidenceController.deleteDonate2Residence);
route.get("/byDonateStats", donate2ResidenceController.getDonateStats);
route.get("/byDonateStats/:id", donate2ResidenceController.getDonateStatsById);
route.get(
	"/byResidenceStats/:id",
	donate2ResidenceController.getResidenceStatsById
);
route.get("/byResidenceStats", donate2ResidenceController.getResidenceStats);
module.exports = route;
