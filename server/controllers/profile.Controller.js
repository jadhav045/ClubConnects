import { Club } from "../models/Roles/Club.Model.js";
import { College } from "../models/Roles/College.Model.js";
import { Faculty } from "../models/Roles/Faculty.Model.js";
import { StudentAlumni } from "../models/Roles/StudentAlumni.Model.js";
import { User } from "../models/User.Model.js";
import bcrypt from "bcryptjs";

// Admin profile has been remained
export const updateStudentAlumniProfileFn = async (req, res) => {
	const { studentAlumniId } = req.params;
	const { userData, studentAlumniData } = req.body;

	try {
		// Find the Student/Alumni profile
		const studentAlumni = await StudentAlumni.findById(studentAlumniId);
		if (!studentAlumni)
			return res.status(404).json({ message: "Student/Alumni not found" });

		// Update User Schema
		const user = await User.findById(studentAlumni.userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		Object.assign(user, userData);
		await user.save();

		// Update Student/Alumni Schema
		Object.assign(studentAlumni, studentAlumniData);
		await studentAlumni.save();

		// Update College Details (if applicable)

		res.status(200).json({
			message: "Student/Alumni profile updated successfully",
			studentAlumni,
			user,
		});
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

export const updateClubProfileFn = async (req, res) => {
	const { clubId } = req.params;
	const { clubData } = req.body;

	try {
		// Find the Club profile
		const club = await Club.findById(clubId);
		if (!club) return res.status(404).json({ message: "Club not found" });

		// Update Club Schema
		Object.assign(club, clubData);
		await club.save();

		res.status(200).json({
			message: "Club profile updated successfully",
			club,
		});
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

export const updateFacultyProfileFn = async (req, res) => {
	const { facultyId } = req.params;
	const { userData, facultyData, collegeId } = req.body;

	try {
		// Find the faculty profile
		const faculty = await Faculty.findById(facultyId);
		if (!faculty) return res.status(404).json({ message: "Faculty not found" });

		// Update User Schema
		const user = await User.findById(faculty.userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		Object.assign(user, userData);
		await user.save();

		// Update Faculty Schema
		Object.assign(faculty, facultyData);
		faculty.college = collegeId || faculty.college;
		await faculty.save();

		// Update College Admin Details (if applicable)
		if (collegeId) {
			const college = await College.findById(collegeId);
			if (!college)
				return res.status(404).json({ message: "College not found" });

			college.adminDetails.updatedBy = faculty._id;
			college.adminDetails.updatedAt = new Date();
			await college.save();
		}

		res.status(200).json({
			message: "Faculty profile updated successfully",
			faculty,
			user,
		});
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

export const updateCollegeProfile = async (req, res) => {
	console.log("Collge Data", req.body);
	try {
		const { id } = req.params;
		const updatedCollege = await College.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		if (!updatedCollege) {
			return res.status(404).json({ message: "College not found" });
		}

		res
			.status(200)
			.json({ message: "College profile updated", updatedCollege });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Failed to update college profile", error });
	}
};
