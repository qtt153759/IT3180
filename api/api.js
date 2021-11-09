// configure environment variable
require('dotenv').config()

const express = require("express")
const app = express()

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

// database
const db = require("./models/index");

db.sequelize.sync().then((data, err) =>{
    if(err)  console.log("err: "+ err);
    if(data) console.log("data: "+ data);
});

require("./routes/demographics.route")(app);

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
