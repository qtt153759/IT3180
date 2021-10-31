const db = require("../models")
const Demographics = db.demographics;

exports.create = (req, res) => {
    if(!req.body) {
        res.status(400).send({
            message: "body cannot be empty!"
        })
        return;
    }

    const demographics = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
    }

    Demographics.create(demographics).then((data, err) => {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Book."
            });
        }

        res.send(data);
    })
}
