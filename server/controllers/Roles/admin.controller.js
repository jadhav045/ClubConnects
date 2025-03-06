import { Club } from "../../models/Roles/Club.Model.js";
import { College } from "../../models/Roles/College.Model.js";
import { Faculty } from "../../models/Roles/Faculty.Model.js";
import { StudentAlumni } from "../../models/Roles/StudentAlumni.Model.js";
import { User } from "../../models/User.Model.js";
import bcrypt from "bcryptjs";
export const createCollege = async (req, res) => {
	try {
		const {
			name,
			collegeCode,
			universityAffiliation,
			address,
			contactInfo,
			establishedYear,
		} = req.body;

		const newCollege = new College({
			name,
			collegeCode,
			universityAffiliation,
			address,
			contactInfo,
			establishedYear,
			adminDetails: { createdBy: req.user.id },
		});

		await newCollege.save();
		res
			.status(201)
			.json({ message: "College created successfully", newCollege });
	} catch (error) {
		res.status(500).json({ message: "Failed to create college", error });
	}
};


export const createFacultyFn = async (req, res) => {
	const { fullName, prn, role, email, password, subRole } = req.body;
	const { collegeId } = req.params;

	console.log(collegeId);
	try {
		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create User
		const newUser = new User({
			fullName,
			prn,
			role,
			email,
			password: hashedPassword,
		});

		const savedUser = await newUser.save();

		console.log("User created successfully");
		// Create Faculty Profile
		const newFaculty = new Faculty({
			userId: savedUser._id,
			college: collegeId,
			subRole: subRole || "Junior Faculty", // Set subRole with default value
		});

		const savedFaculty = await newFaculty.save();

		// Link Faculty ID to User
		savedUser.profileId = savedFaculty._id;
		await savedUser.save();

		// Update College with Faculty ID
		const college = await College.findById(collegeId);
		if (!college) return res.status(404).json({ message: "College not found" });

		college.facultyCount += 1;
		college.adminDetails = {
			createdBy: savedFaculty._id,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		await college.save();

		res.status(201).json({
			message: "Faculty created and linked successfully",
			faculty: savedFaculty,
		});
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};
