const express = require("express");

const donate2ResidenceStatsController = require("../controllers/donate2ResidenceStats.controller");
const route = express.Router();
route.get("/donate", donate2ResidenceStatsController.getDonateStats);
route.get("/donate/:id", donate2ResidenceStatsController.getDonateStatsById);
route.get("/residence/:id", donate2ResidenceStatsController.getResidenceStatsById);
route.get("/residence", donate2ResidenceStatsController.getResidenceStats);
module.exports = route;
