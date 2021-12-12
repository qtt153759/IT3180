const express = require("express");
const route = express.Router();
const residenceController = require("../controllers/residence.controller");

route.get("/", residenceController.getAll);
route.get("/:id", residenceController.getResidenceById);
route.post("/", residenceController.create);
route.put("/update", residenceController.update);
route.delete("/delete/:id", residenceController.deleteResidence);

module.exports = route;
