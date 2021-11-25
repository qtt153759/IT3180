// configure environment variable
require("dotenv").config();
const sequelize = require("./models/index");

const express = require("express");
const app = express();
const createError = require("http-errors");

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

// database

sequelize
	.sync({ alter: true })
	.then((data, err) => {
		if (err) console.log("err: " + err);
		if (data) console.log("data: " + data);
	})
	.catch((err) => {
		console.log(err);
	});

require("./routes/demographics.route")(app);
require("./routes/residence.route")(app);
require("./routes/address.route")(app);

app.use((req, res, next) => {
	// const error = new Error("not found");
	//
	// error.status = 500;
	// next(error);

	next(createError(404, "Not Found"));
});

app.use((err, req, res, next) => {
	return res.json({
		status: err.status || 500,
		message: err.message,
	});
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server is running on port 3000`);
});
