const express = require("express");
const route = express.Router();
const residenceController = require("../controllers/residence.controller");

route.get("/", residenceController.getAll);
route.post("/", residenceController.create);
route.get("/:id", residenceController.getResidenceById);
route.put("/update", residenceController.update);
route.delete("/delete/:id", residenceController.deleteResidence);

module.exports = route;
