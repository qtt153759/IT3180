const express = require("express");
const nationController = require("../controllers/nation.controller");

const route = express.Router();

route.get("/", nationController.getNation);

module.exports = route;
