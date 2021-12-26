// configure environment variable
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const sequelize = require("./models/index");
const app = express();
const createError = require("http-errors");

const ResidenceRoute = require("./routes/residence.route");
const DemographicsRoute = require("./routes/demographics.route");
const AddressRoute = require("./routes/address.route");
const AccountRoute = require("./routes/account.route");
const DonateRoute = require("./routes/donate.route");
const Donate2ResidenceRoute = require("./routes/donate2Residence.route");
const Donate2ResidenceRouteStats = require("./routes/donate2ResidenceStats.route");
const NationRoute = require("./routes/nation.route");
const AbsentStayRoute = require("./routes/absentStay.route");

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use(cors());

// database
sequelize
	.sync({ alter: true, logging: false })
	.then((data, err) => {
		if (err) console.log("err: " + err);
	})
	.catch((err) => {
		console.log(err);
	});

app.use("/api/residence", ResidenceRoute);
app.use("/api/demographics", DemographicsRoute);
app.use("/api/address", AddressRoute);
app.use("/api/account", AccountRoute);
app.use("/api/donate", DonateRoute);
app.use("/api/donate2Residence", Donate2ResidenceRoute);
app.use("/api/donate2ResidenceStats", Donate2ResidenceRouteStats);
app.use("/api/nation", NationRoute);
app.use("/api/absentStay", AbsentStayRoute);
app.use((req, res, next) => {
	next(createError(404, "Not Found"));
});

app.use((err, req, res, next) => {
	return res.json({
		status: err.status || 500,
		message: err.message,
	});
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
