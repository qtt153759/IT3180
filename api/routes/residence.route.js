module.exports = (app) => {
	const residenceController = require("../controllers/residence.controller");

	const router = require("express").Router();

	router.post("/", residenceController.create);
	router.get("/", residenceController.getAll);
	router.post("/update", residenceController.update);
	router.get("/delete", residenceController.delete);

	app.use("/api/residence", router);
};
