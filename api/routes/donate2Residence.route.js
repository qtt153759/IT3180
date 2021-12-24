const express = require("express");

const donate2ResidenceController = require("../controllers/donate2Residence.controller");
const route = express.Router();

route.get("/", donate2ResidenceController.getAllDonate2Residence);
route.get("/byResidence/:id", donate2ResidenceController.getDonate2ResidenceByResidence);
route.get("/byDonate/:id", donate2ResidenceController.getDonate2ResidenceByDonate);
route.post("/", donate2ResidenceController.createDonate2Residence);
route.put("/update",donate2ResidenceController.updateDonate2Residence)
route.delete("/delete/:id",donate2ResidenceController.deleteDonate2Residence)
route.get("/stats",donate2ResidenceController.getStats)
route.get("/stats/:id",donate2ResidenceController.getStatsById)
module.exports = route;
