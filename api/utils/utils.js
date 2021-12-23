const addressData = require("../data/dvhcvn.json");

let getDistricts = (provinceId) => {
	return addressData.data.find((province) => {
		let normalize = (+provinceId).toLocaleString("en-US", {
			minimumIntegerDigits: 1,
			useGrouping: false,
		});

		let normalizeId = (+province.level1_id).toLocaleString("en-US", {
			minimumIntegerDigits: 1,
			useGrouping: false,
		});
		return normalizeId === normalize;
	});
};

let getWards = (provinceId, districsId) => {
	let listDistrict = getDistricts(provinceId);

	if (!listDistrict) return null;

	return listDistrict.level2s.find((district) => {
		let normalize = (+district.level2_id).toLocaleString("en-US", {
			minimumIntegerDigits: 1,
			useGrouping: false,
		});

		let normalizeDistrictId = (+districsId).toLocaleString("en-US", {
			minimumIntegerDigits: 1,
			useGrouping: false,
		});

		return normalize === normalizeDistrictId;
	});
};

module.exports = { getDistricts, getWards };
