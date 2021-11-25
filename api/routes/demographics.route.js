module.exports = (app) => {
	const demographicsController = require("../controllers/demographics.controller");

	const router = require("express").Router();

	router.post("/", demographicsController.create);
	router.get("/", demographicsController.retrieveAll);
	router.put("/update", demographicsController.update);
	router.delete("/delete/:id", demographicsController.delete);

	app.use("/api/demographics", router);
};
