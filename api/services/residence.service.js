const ResidenceHistory = require("../models/residenceHistory.model");

let logResidenceHistory = async (data) => {
	await ResidenceHistory.create(data);
};

module.exports = {
	logResidenceHistory,
};
