import { Club } from "../../models/Roles/Club.Model.js";
import { Faculty } from "../../models/Roles/Faculty.Model.js";
import { StudentAlumni } from "../../models/Roles/StudentAlumni.Model.js";
import { User } from "../../models/User.Model.js";

export const createClubFn = async (req, res) => {
	const { clubName, shortName, motto, description, collegeId, presidentId } =
		req.body;
	const { facultyId } = req.params;

	if (!clubName || !presidentId || !facultyId || !collegeId) {
		return res.status(400).json({ message: "Missing required fields" });
	}

	try {
		// Check if club already exists
		const existingClub = await Club.findOne({ clubName });
		if (existingClub) {
			return res.status(400).json({ message: "Club already exists" });
		}

		// Validate president user
		const presidentUser = await User.findById(presidentId);
		if (!presidentUser) {
			return res.status(404).json({ message: "President user not found" });
		}

		// Validate faculty user
		const facultyUser = await User.findById(facultyId);
		if (!facultyUser) {
			return res.status(404).json({ message: "Faculty user not found" });
		}

		const f = await Faculty.findById(facultyUser.profileId);

		if (!f) {
			throw new Error("Faculty not found");
		}

		// Create new club
		const newClub = new Club({
			clubName,
			shortName,
			motto,
			description,
			collegeId,
			createdBy: facultyUser._id, // Use facultyUser._id
			members: [
				{
					userId: presidentId,
					role: "President",
					joinedDate: new Date(),
				},
			],
		});

		// Save the new club first
		await newClub.save();

		// Push the new club ID into the faculty's `createdClub` array
		f.createdClub.push(newClub._id);

		// Save the updated faculty document
		await f.save();

		// Update president's clubsJoined
		const studentAlumni = await StudentAlumni.findOne({ userId: presidentId });
		if (studentAlumni) {
			studentAlumni.clubsJoined.push({
				clubId: newClub._id,
				role: "President",
				joinedDate: new Date(),
			});
			await studentAlumni.save();
		} else {
			return res
				.status(404)
				.json({ message: "Student/Alumni profile not found for president" });
		}

		return res
			.status(201)
			.json({ message: "Club created successfully", club: newClub });
	} catch (err) {
		console.error("Error creating club:", err);
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

export const assignRoleFn = async (req, res) => {
	const { userId, clubId, role } = req.body;
	console.log("UserId to assign role", req.body);
	try {
		// Validate user
		const user = await User.findById(userId);
		if (!user) {
			return res.json({
				messaege: "User not found",
				success: false,
			});
		}

		// Validate club
		const club = await Club.findById(clubId);
		if (!club) {
			return res.json({
				messaege: "Club not found",
				success: false,
			});
		}

		// Check if user already has a role in the club
		const studentAlumni = await StudentAlumni.findOne({ userId });
		if (studentAlumni) {
			const existingRoleIndex = studentAlumni.clubsJoined.findIndex(
				(club) => club.clubId.toString() === clubId.toString()
			);

			if (existingRoleIndex !== -1) {
				// Update existing role
				studentAlumni.clubsJoined[existingRoleIndex].role = role;
			} else {
				// Add new role
				studentAlumni.clubsJoined.push({
					clubId,
					role,
					joinedDate: new Date(),
				});
			}
			await studentAlumni.save();
		}

		// Update club members
		const isMember = club.members.some(
			(member) => member.userId.toString() === userId.toString()
		);

		if (!isMember) {
			club.members.push({
				userId,
				role,
				joinedDate: new Date(),
			});
		} else {
			club.members = club.members.map((member) =>
				member.userId.toString() === userId.toString()
					? { ...member, role }
					: member
			);
		}

		await club.save();
		return { message: "Role assigned successfully" };
	} catch (error) {
		throw new Error(error.message);
	}
};

// Let me know if you want me to integrate this into the create/update club functions! 🚀

export const getAllClubs = async (req, res) => {
	try {
		console.log("Backend of Clubs");
		let clubs = await Club.find();
		clubs = await Club.populate(clubs, {
			path: "members.userId",
			select: "_id email fullName",
		});

		console.log("clubs", clubs.members);
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
