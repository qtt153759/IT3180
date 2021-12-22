const express = require("express");

const absentStayController = require("../controllers/absentStay.controller");
const route = express.Router();

route.get("/", absentStayController.getAllStayAbsent);
route.get("/:id", absentStayController.getStayAbsentById);
route.post("/absent", absentStayController.createAbsent);


module.exports = route;