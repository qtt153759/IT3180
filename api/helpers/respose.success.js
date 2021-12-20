module.exports = (data, totalResult, page, limit) => {
	return {
		success: true,
		message: "Success",
		data: data,
		total_result: totalResult,
		page,
		limit,
	};
};
