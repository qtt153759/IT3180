module.exports = (app) => {
	const demographicsController = require("../controllers/demographics.controller");

	const router = require("express").Router();

	router.post("/", demographicsController.create);
	router.get("/", demographicsController.retrieveAll);
	router.post("/update", demographicsController.update);
	router.get("/delete/:id", demographicsController.delete);

	app.use("/api/demographics", router);
};
