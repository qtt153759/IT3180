module.exports = (app) => {
	const demographicsController = require("../controllers/demographics.controller");

	const router = require("express").Router();

	router.post("/", demographicsController.createDemographics);
	router.get("/", demographicsController.retrieveAllDemographic);
	router.put("/update", demographicsController.updateDemographic);
	router.delete("/delete/:id", demographicsController.deleteDemographics);

	app.use("/api/demographics", router);
};
