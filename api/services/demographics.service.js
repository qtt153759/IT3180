let checkAge = async (age) => {
	let upper = 150;
	let lower = 0;
	switch (age) {
		case "Infant":
			upper = 3;
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
			lower = 20;
			break;
		case "Older":
			lower = 61;
			break;
	}
	return { upper, lower };
};
module.exports = {
	checkAge,
};
