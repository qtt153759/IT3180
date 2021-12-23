const express = require("express");
const route = express.Router();
const demographicsController = require("../controllers/demographics.controller");

route.get("/", demographicsController.retrieveAllDemographic);
route.get("/stas", demographicsController.getDemographicsStas);
route.get("/:id", demographicsController.getDemographicsById);
route.post("/", demographicsController.createDemographics);
route.put("/update", demographicsController.updateDemographic);
route.delete("/delete/:id", demographicsController.deleteDemographics);
route.put("/update/status/:id", demographicsController.updateDemographicStatus);

route.get("/nation");

module.exports = route;
