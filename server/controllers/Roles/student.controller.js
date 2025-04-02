import { Club } from "../../models/Roles/Club.Model.js";
export const getClubs = async (req, res) => {
	try {
		console.log("Backend of Lcubs");
		const { page = 1, limit = 10, type } = req.query;

		const pageNumber = parseInt(page, 10);
		const limitNumber = parseInt(limit, 10);

		const query = type ? { type } : {};

		const clubs = await Club.find(query)
			.skip((pageNumber - 1) * limitNumber)
			.limit(limitNumber)
			.sort({ createdAt: -1 });

		const total = await Club.countDocuments(query);

		// console.log(clubs);
		return res.status(200).json({
			message: "Clubs fetched successfully",
			data: clubs, // Corrected variable name
			pagination: {
				total,
				page: pageNumber,
				limit: limitNumber,
				totalPages: Math.ceil(total / limitNumber),
			},
		});
	} catch (error) {
		console.error("Error fetching clubs:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
export const getGivenClub = async (req, res) => {
	const { clubId } = req.params;

	try {
		const club = await Club.findById(clubId)
			.populate({
				path: "members.userId",
				select: "profilePicture _id fullName",
			})
			.populate({
				path: "followers",
				select: "profilePicture _id fullName",
			})
			.exec();

		if (!club) {
			return res.status(404).json({
				message: "Club not found",
				success: false,
			});
		}

		return res.json({
			message: "Club fetched successfully",
			success: true,
			club,
		});
	} catch (error) {
		console.error("Error fetching club:", error);
		return res.status(500).json({
			message: "Server error",
			success: false,
			error: error.message,
		});
	}
};
export const updateClub = async (req, res) => {
	const { clubId } = req.params;
	const updateData = req.body;

	try {
		const club = await Club.findByIdAndUpdate(clubId, updateData, {
			new: true,
			runValidators: true,
		});

		if (!club) {
			return res.status(404).json({
				message: "Club not found",
				success: false,
			});
		}

		return res.json({
			message: "Club updated successfully",
			success: true,
			club,
		});
	} catch (error) {
		console.error("Error updating club:", error);
		return res.status(500).json({
			message: "Server error",
			success: false,
			error: error.message,
		});
	}
};
