import { Club } from "../../models/Roles/Club.Model.js";
import uploadImage from "../../utils/fileUpload.js";
import { User } from "../../models/User.Model.js";
import mongoose from "mongoose";
import { StudentAlumni } from "../../models/Roles/StudentAlumni.Model.js";
export const getClubs = async (req, res) => {
	try {
		console.log("Backend of Clubs");

		const clubs = await Club.find();

		console.log(clubs);
		return res.status(200).json({
			success: true,
			message: "Clubs fetched successfully",
			clubs,
		});
	} catch (error) {
		console.error("Error fetching clubs:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

export const getGivenClub = async (req, res) => {
	const { clubId } = req.params;
	console.log("clubId", clubId);

	// Step 1: Validate the clubId format
	if (!mongoose.Types.ObjectId.isValid(clubId)) {
		return res.status(400).json({
			message: "Invalid Club ID format",
			success: false,
		});
	}

	try {
		// Step 2: Fetch only members and followers to check existence
		const clubExists = await Club.findById(clubId).select("members followers");

		if (!clubExists) {
			return res.status(404).json({
				message: "Club not found",
				success: false,
			});
		}

		// Step 3: Build query with conditional population
		let query = Club.findById(clubId);

		if (clubExists.members?.length > 0) {
			query = query.populate({
				path: "members.userId",
				select: "profilePicture _id fullName",
			});
		}

		if (clubExists.followers?.length > 0) {
			query = query.populate({
				path: "followers",
				select: "profilePicture _id fullName",
			});
		}

		// Step 4: Execute the query
		const club = await query.exec();

		return res.status(200).json({
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

	try {
		// Ensure updateData is properly initialized
		let updateData = req.body;

		console.log("Received Data:", updateData);
		console.log("Received File:", req.file); // Check if file is received

		if (!updateData || Object.keys(updateData).length === 0) {
			return res.status(400).json({ message: "No data provided" });
		}

		if (req.file) {
			const logo = await uploadImage(req.file);
			console.log("profile", logo?.fileUrl);
			updateData = {
				...req.body,
				logo: logo?.fileUrl, // Ensure only fileUrl is stored
			};
		} else {
			updateData = {
				...req.body,
			};
		}

		const club = await Club.findByIdAndUpdate(clubId, updateData, {
			new: true,
			runValidators: true,
		});

		console.log(club.logo);
		if (!club) {
			return res.status(404).json({ message: "Club not found" });
		}

		return res.json({ message: "Club updated successfully", club });
	} catch (error) {
		console.error("Error updating club:", error);
		return res
			.status(500)
			.json({ message: "Server error", error: error.message });
	}
};

export const toggleFollowClub = async (req, res) => {
	try {
		const userId = req.user.id; // Get logged-in user ID from middleware
		const { clubId } = req.params;

		console.log("lll");
		// Find the club and user
		const club = await Club.findById(clubId);
		const user = await User.findById(userId);

		if (!club || !user) {
			return res.status(404).json({ message: "Club or User not found" });
		}

		const isFollowing = club.followers.includes(userId);

		if (isFollowing) {
			// Unfollow the club
			club.followers = club.followers.filter((id) => id.toString() !== userId);
			user.following = user.following.filter((id) => id.toString() !== clubId);
		} else {
			// Follow the club
			club.followers.push(userId);
			user.following.push(clubId);
		}

		// Save changes
		await club.save();
		await user.save();

		return res.status(200).json({
			message: isFollowing ? "Unfollowed the club" : "Followed the club",
			updatedClub: club,
		});
	} catch (error) {
		console.error("Error toggling follow:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const assignRole = async (req, res) => {
	try {
		const { userId, clubId, role = "Supporter" } = req.body;

		console.log("Req-body", req.body);
		if (!userId || !clubId) {
			return res
				.status(400)
				.json({ message: "userId and clubId are required" });
		}

		// Find the club
		const club = await Club.findById(clubId);
		if (!club) return res.status(404).json({ message: "Club not found" });

		// Add or update member in club
		const existingMemberIndex = club.members.findIndex((m) =>
			m.userId.equals(userId)
		);
		if (existingMemberIndex >= 0) {
			club.members[existingMemberIndex].role = role;
		} else {
			club.members.push({ userId, role });
		}
		await club.save();

		// Get the user and their profile
		const user = await User.findById(userId);
		if (!user || !user.profileId) {
			return res.status(404).json({ message: "User profileId not found" });
		}

		const student = await StudentAlumni.findById(user.profileId);
		if (!student)
			return res
				.status(404)
				.json({ message: "Student/Alumni profile not found" });

		// Add or update club role in student's clubsJoined
		const joinedClubIndex = student.clubsJoined.findIndex((j) =>
			j.clubId.equals(clubId)
		);
		if (joinedClubIndex >= 0) {
			student.clubsJoined[joinedClubIndex].role = role;
		} else {
			student.clubsJoined.push({ clubId, role });
		}
		await student.save();

		res.status(200).json({
			success: true,
			message: "Role assigned successfully",
			updatedClub: club,
			updatedStudent: student,
		});
	} catch (err) {
		console.error("Assign Role Error:", err.message);
		res.status(500).json({ message: err.message });
	}
};

// AChie

export const addAchievement = async (req, res) => {
	try {
		const { title, description, date } = req.body;
		const { clubId } = req.params;

		let achievementData = { title, description, date };

		if (req.file) {
			const logo = await uploadImage(req.file); // your helper
			console.log("Achievement image:", logo?.fileUrl);
			achievementData.image = logo?.fileUrl;
		}

		const club = await Club.findById(clubId);
		if (!club) return res.status(404).json({ error: "Club not found" });

		club.achievements.push(achievementData);
		await club.save();

		res.status(201).json({ message: "Achievement added", club });
	} catch (error) {
		console.error("Add Achievement Error:", error);
		res.status(500).json({ error: "Server Error" });
	}
};
// Delete Achievement
export const deleteAchievement = async (req, res) => {
	try {
		const { clubId, achievementId } = req.params;

		const club = await Club.findById(clubId);
		if (!club) return res.status(404).json({ error: "Club not found" });

		club.achievements = club.achievements.filter(
			(ach) => ach._id.toString() !== achievementId
		);

		await club.save();
		res.status(200).json({ message: "Achievement deleted", club });
	} catch (error) {
		console.error("Delete Achievement Error:", error);
		res.status(500).json({ error: "Server Error" });
	}
};

// Update Achievement
export const updateAchievement = async (req, res) => {
	try {
		const { clubId, achievementId } = req.params;
		const { title, description, date } = req.body;

		let updateData = {
			title,
			description,
			date,
		};

		if (req.file) {
			const logo = await uploadImage(req.file);
			console.log("Updated image:", logo?.fileUrl);
			updateData.image = logo?.fileUrl;
		}

		const club = await Club.findById(clubId);
		if (!club) return res.status(404).json({ error: "Club not found" });

		const achievement = club.achievements.id(achievementId);
		if (!achievement)
			return res.status(404).json({ error: "Achievement not found" });

		// Apply updates
		Object.assign(achievement, updateData);

		await club.save();
		res.status(200).json({ message: "Achievement updated", club });
	} catch (error) {
		console.error("Update Achievement Error:", error);
		res.status(500).json({ error: "Server Error" });
	}
};

// FIle uploading checking
