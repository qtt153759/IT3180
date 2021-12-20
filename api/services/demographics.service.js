let checkAge = async (age) => {
	let upper = 150;
	let lower = 0;
	switch (age) {
		case "Infant":
			upper = 2;
			lower = 0;
			break;
		case "Kindergarten":
			upper = 5;
			lower = 3;
			break;
		case "Primary-School":
			upper = 6;
			lower = 10;
			break;
		case "Secondary-School":
			upper = 11;
			lower = 15;
			break;
		case "High-School":
			upper = 16;
			lower = 19;
			break;
		case "Adult":
			upper = 20;
			lower = 60;
			break;
		case "Older":
			upper = 61;
			lower = 150;
			break;
	}
	return { upper, lower };
};
module.exports={
    checkAge
}