const express = require("express");

const feeController = require("../controllers/fee.controller");
const route = express.Router();

route.get("/", feeController.getFee);
route.post("/", feeController.createFee);
route.put("/update",feeController.updateFee)
route.delete("/delete/:id",feeController.deleteFee)

module.exports = route;
