let checkAge = async (age) => {
	let upper = 150;
	let lower = 0;
	switch (age) {
		case "Infant":
			upper = 3;
			lower = 0;
			break;
		case "Kindergarten":
			upper = 6;
			lower = 3;
			break;
		case "Primary-School":
			upper = 11;
			lower = 6;
			break;
		case "Secondary-School":
			upper = 16;
			lower = 11;
			break;
		case "High-School":
			upper = 18;
			lower = 16;
			break;
		case "Adult":
			upper = 60;
			lower = 18;
			break;
		case "Older":
			upper = 150;
			lower = 60;
			break;
	}
	return { upper, lower };
};
module.exports = {
	checkAge,
};
