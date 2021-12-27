const express = require("express");

const accountController = require("../controllers/account.controller");
const route = express.Router();
const author = require("../middlewares/author");
const authen = require("../middlewares/authen");

route.get("/", authen, author([]), accountController.getAllAccount);
route.post("/login", accountController.handleLogin);
route.post("/register", authen, author([]), accountController.createAccount);
route.get("/profile", authen, author([]), accountController.getProfile);

module.exports = route;
