const express = require("express");
const addressController = require("../controllers/address.controller");

const route = express.Router();

route.get("/province", addressController.getProvince);
route.get("/district/:province_id", addressController.getDistrict);
route.get("/ward/:province_id/:district_id", addressController.getWard);

module.exports = route;
