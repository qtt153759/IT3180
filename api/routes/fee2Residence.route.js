const express = require("express");

const fee2ResidenceController = require("../controllers/fee2Residence.controller");
const route = express.Router();

route.get("/", fee2ResidenceController.getFee2Residence);
route.post("/", fee2ResidenceController.createFee2Residence);
route.put("/update",fee2ResidenceController.updateFee2Residence)
route.delete("/delete/:id",fee2ResidenceController.deleteFee2Residence)

module.exports = route;
