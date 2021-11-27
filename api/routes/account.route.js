module.exports = (app) => {
	const accountController = require("../controllers/account.controller");

	const router = require("express").Router();

	router.post("/",accountController.handleLogin);
	router.post("/register",accountController.createAccount)

	app.use("/api/login", router);
};