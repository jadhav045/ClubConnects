const handleViewResponses = async (type) => {
	try {
		handleMenuClose();
		setLoadingResponses(true);

		const res = await axios.get(
			`http://localhost:3002/form/Event/${event._id}/${type}`
		);

		setResponses(res.data);
		setResponseDialogOpen(true);
	} catch (err) {
		console.error("Error fetching responses:", err.message);
		setResponsesError("Error loading responses.");
	} finally {
		setLoadingResponses(false);
	}
};
