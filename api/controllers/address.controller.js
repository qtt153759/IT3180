const addressData = require("../models/dvhcvn.json");
const utils = require("../utils/utils");

exports.getProvince = (req, res) => {
	const listProvince = addressData.data;
	res.send({
		data: listProvince.map((province) => {
			return {
				id: (+province.level1_id).toLocaleString("en-US", {
					minimumIntegerDigits: 1,
					useGrouping: false,
				}),
				name: province.name,
				type: province.type,
			};
		}),
	});
};

exports.getDistrict = (req, res) => {
	if (!req.params.province_id)
		return res.send({
			message: "Undifine paramester",
		});

	let listDistrict = utils.getDistricts(req.params.province_id);
	if (!listDistrict)
		return res.send({
			message: "Cannot find disctrict",
		});

	return res.send({
		data: listDistrict.level2s.map((district) => {
			let normalizeId = (+district.level2_id).toLocaleString("en-US", {
				minimumIntegerDigits: 1,
				useGrouping: false,
			});

			return {
				id: normalizeId,
				name: district.name,
				type: district.type,
			};
		}),
	});
};

exports.getWard = (req, res) => {
	let listWard = utils.getWards(
		req.params.province_id,
		req.params.district_id
	);
	if (!listWard)
		return res.send({
			message: "Cannot find province",
		});

	return res.send({
		data: listWard.level3s.map((ward) => {
			return {
				id: (+ward.level3_id).toLocaleString("en-US", {
					minimumIntegerDigits: 1,
					useGrouping: false,
				}),
				name: ward.name,
				type: ward.type,
			};
		}),
	});
};
