const express = require("express");

const accountController = require("../controllers/account.controller");
const author = require("../middlewares/author");
const route = express.Router();

route.post("/login", accountController.handleLogin);
route.post("/register", accountController.createAccount);

module.exports = route;
