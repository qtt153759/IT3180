// configure environment variable
require("dotenv").config();
const sequelize = require("./models/index");

const express = require("express");
const app = express();
const createError = require("http-errors");

//app.use(cors({origin:true}));//tranh loi cors server ten mien// khong co tac dung localhost
app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT); //cho phep cong 3000 cua ben react

	// Request methods you wish to allow
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);

	// Request headers you wish to allow
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader("Access-Control-Allow-Credentials", true);

	// Pass to next layer of middleware
	next();
});
const ResidenceRoute = require("./routes/residence.route");
const DemographicsRoute = require("./routes/demographics.route");
const AddressRoute = require("./routes/address.route");
const AccountRoute = require("./routes/account.route");

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

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
