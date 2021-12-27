const express = require("express");

const accountController = require("../controllers/account.controller");
const route = express.Router();
const authen = require("../middlewares/authen");

route.get("/", authen, accountController.getAllAccount);
route.post("/login", accountController.handleLogin);
route.post("/register", accountController.createAccount);
route.get("/profile", authen, accountController.getProfile);

module.exports = route;
