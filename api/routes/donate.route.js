const express = require("express");

const donateController = require("../controllers/donate.controller");
const route = express.Router();

route.get("/", donateController.getDonate);
route.post("/", donateController.createDonate);
route.put("/update", donateController.updateDonate);
route.delete("/delete/:id", donateController.deleteDonate);

module.exports = route;
