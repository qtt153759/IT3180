const createError = require("http-errors");
const nationData = require("./../models/nation.json");
exports.getNation = (req, res) => {
	const listNation = nationData.data;
	res.send({
		data: listNation.map((nation) => {
			return {
				id: nation.id.toLocaleString("en-US", {
					minimumIntegerDigits: 1,
					useGrouping: false,
				}),
				name: nation.name,
				alias: nation.alias,
			};
		}),
	});
};
