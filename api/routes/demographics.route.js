const express = require("express");
const route = express.Router();
const demographicsController = require("../controllers/demographics.controller");

route.get("/", demographicsController.retrieveAllDemographic);
route.post("/", demographicsController.createDemographics);
route.put("/update", demographicsController.updateDemographic);
route.delete("/delete/:id", demographicsController.deleteDemographics);

module.exports = route;
