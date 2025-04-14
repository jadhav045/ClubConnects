import { Club } from "../../models/Roles/Club.Model.js";
import { College } from "../../models/Roles/College.Model.js";
import { Faculty } from "../../models/Roles/Faculty.Model.js";
import { StudentAlumni } from "../../models/Roles/StudentAlumni.Model.js";
import { User } from "../../models/User.Model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import uploadImage from "../../utils/fileUpload.js";
export const createCollege = async (req, res) => {
	console.log("We are here");
	try {
		const {
			name,
			collegeCode,
			universityAffiliation,
			address,
			contactInfo,
			establishedYear,
		} = req.body;

		const userId = req.user.id;

		// Validate required fields
		if (!name || !collegeCode || !address || !contactInfo || !establishedYear) {
			return res.status(400).json({
				success: false,
				message: "All required fields must be filled",
			});
		}

		// Check for duplicate college code
		const existingCollege = await College.findOne({ collegeCode });
		if (existingCollege) {
			return res.status(409).json({
				success: false,
				message: "College with this code already exists",
			});
		}

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

		// Update the user’s createdCollege array
		await User.findByIdAndUpdate(
			userId,
			{ $push: { createdCollege: newCollege._id } },
			{ new: true }
		);

		return res.status(201).json({
			message: "College created successfully",
			newCollege,
			success: true,
		});
	} catch (error) {
		console.error("Error creating college:", error);
		res.status(500).json({
			success: false,
			message: "Failed to create college",
			error: error.message,
		});
	}
};

// Let me know if you want me to add more validations or refine the structure even further! 🚀

export const createFacultyFn = async (req, res) => {
	const { fullName, prn, role, email, password, subRole } = req.body;
	const { collegeId } = req.params;

	try {
		// Check for required fields
		if (!fullName || !prn || !role || !email || !password || !collegeId) {
			return res.status(400).json({
				success: false,
				message: "All required fields must be provided",
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({
				success: false,
				message: "Invalid email format",
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "User with this email already exists",
			});
		}

		// Check if college exists
		const college = await College.findById(collegeId);
		if (!college) {
			return res.status(404).json({
				success: false,
				message: "College not found",
			});
		}

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

		// Create Faculty Profile
		const newFaculty = new Faculty({
			userId: savedUser._id,
			college: collegeId,
			subRole: subRole || "Junior Faculty",
		});

		const savedFaculty = await newFaculty.save();

		// Link Faculty ID to User
		savedUser.profileId = savedFaculty._id;
		await savedUser.save();

		// Update College with Faculty ID and admin details
		college.facultyCount += 1;
		college.adminDetails = {
			createdBy: savedFaculty._id,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		await college.save();

		res.status(201).json({
			success: true,
			message: "Faculty created and linked successfully",
			faculty: savedFaculty,
		});
	} catch (err) {
		console.error("Error creating faculty:", err);
		res.status(500).json({
			success: false,
			message: "Server error while creating faculty",
			error: err.message,
		});
	}
};

// store in redux then sort out with college id
export const getAllFacultiesList = async (req, res) => {
	// console.log(req.params);
	const { collegeId } = req.params;
	console.log(collegeId);
	// const collegeId = "67de441a8426857e3adc43e2";
	try {
		const faculties = await User.find({ role: "Faculty" })
			.select("email fullName profileId")
			.populate({
				path: "profileId",
				model: "Faculty",
				select: "subRole college",
				match: { college: collegeId }, // Ensures only faculty from the correct college
			})
			.lean();

		// Manually filter out users where profileId is null (no match found)
		const filteredFaculties = faculties.filter(
			(faculty) => faculty.profileId !== null
		);

		console.log(filteredFaculties);

		// Handle case when no faculty users are found
		if (!faculties || faculties.length === 0) {
			return res
				.status(404)
				.json({ message: "No faculty users found for this college." });
		}

		// Return the list of faculties
		return res.status(200).json({
			message: "Faculty list retrieved successfully",
			success: true,
			data: filteredFaculties,
		});
	} catch (error) {
		// Handle unexpected server errors
		console.error("Error fetching faculty list:", error);
		res.status(500).json({
			message: "Server error while fetching faculty list",
			error: error.message,
		});
	}
};

// Let me know if you want me to add any other filters or enhancements! 🚀

export const getAllCollegeList = async (req, res) => {
	try {
		const colleges = await College.find()
			.select("name collegeCode universityAffiliation adminDetails")
			.populate({
				path: "adminDetails",
				select: "fullName email",
			});

		console.log(colleges);
		// Return the list of colleges
		res.status(200).json({
			message: "College list retrieved successfully",
			success: true,
			data: colleges,
		});
	} catch (error) {
		console.error("Error fetching college list:", error);
		res.status(500).json({
			message: "Server error while fetching college list",
			error: error.message,
		});
	}
};

export const getAllUsers = async (req, res) => {
	try {
		console.log("Fetching users...");

		const { search = "", limit = 10, page = 1 } = req.query; // Extract search and pagination params

		// Define search criteria (e.g., search by name or email)
		const filter = search
			? {
					$or: [
						{ name: { $regex: search, $options: "i" } }, // Case-insensitive search by name
						{ email: { $regex: search, $options: "i" } }, // Case-insensitive search by email
					],
			  }
			: {};

		// Fetch users with pagination and populate profile details
		const users = await User.find(filter)
			.select("name email _id") // Select only required fields
			.populate("profileId", "bio profilePicture") // Populate specific fields from profileId
			.limit(parseInt(limit)) // Limit number of results
			.skip((parseInt(page) - 1) * parseInt(limit)); // Implement pagination

		// Get total count of users for frontend pagination
		const totalUsers = await User.countDocuments(filter);

		return res.status(200).json({
			users,
			totalUsers,
			currentPage: parseInt(page),
			totalPages: Math.ceil(totalUsers / limit),
			message: "Users fetched successfully",
			success: true,
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		return res.status(500).json({
			message: "Failed to fetch users",
			success: false,
			error: error.message,
		});
	}
};

export const getCollegeById = async (req, res) => {
	try {
		const collegeId = req.params.id;
		console.log("College ID:", collegeId);

		if (!mongoose.Types.ObjectId.isValid(collegeId)) {
			return res.status(400).json({ message: "Invalid College ID format" });
		}

		const college = await College.findById(collegeId);
		if (!college) {
			return res.status(404).json({ message: "College not found" });
		}

		res.json(college);
	} catch (error) {
		console.error("Error fetching college:", error);
		res.status(500).json({ message: "Server error" });
	}
};
// Update full college profile
// Update route handler
export const updateCollegeProfile = async (req, res) => {
	try {
		console.log("Update payload:", req.body);

		// Validate request body
		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({ message: "No update data provided" });
		}

		// Handle nested updates properly
		const updateOperations = {};
		for (const [key, value] of Object.entries(req.body)) {
			if (typeof value === "object" && !Array.isArray(value)) {
				// Handle nested objects using dot notation
				for (const [nestedKey, nestedValue] of Object.entries(value)) {
					updateOperations[`${key}.${nestedKey}`] = nestedValue;
				}
			} else {
				updateOperations[key] = value;
			}
		}

		const updatedCollege = await College.findByIdAndUpdate(
			req.params.id,
			{ $set: updateOperations },
			{
				new: true,
				runValidators: true,
				context: "query", // Required for proper validation
			}
		).populate("collegeAdmins");
		// .populate("announcements");

		if (!updatedCollege) {
			return res.status(404).json({ message: "College not found" });
		}

		res.json({
			message: "College updated successfully",
			college: updatedCollege,
		});
	} catch (error) {
		console.error("Update error:", error);

		// Handle validation errors
		if (error.name === "ValidationError") {
			const messages = Object.values(error.errors).map((err) => err.message);
			return res.status(400).json({ message: messages.join(", ") });
		}

		// Handle duplicate key errors
		if (error.code === 11000) {
			const field = Object.keys(error.keyPattern)[0];
			return res.status(409).json({
				message: `${field} already exists and must be unique`,
			});
		}

		// Handle CastError (invalid ID format)
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid college ID format" });
		}

		res.status(500).json({
			message: "Server error during update",
			error: process.env.NODE_ENV === "development" ? error.message : undefined,
		});
	}
};
// Upload/update college logo
export const uploadCollegeLogo = async (req, res) => {
	try {
		console.log(req.file);

		if (!req.file) return res.status(400).json({ message: "No logo uploaded" });
		const logoPath = await uploadImage(req.file);

		const updated = await College.findByIdAndUpdate(
			req.params.id,
			{ logo: logoPath.fileUrl },
			{ new: true }
		);

		if (!updated) return res.status(404).json({ message: "College not found" });

		res.json({ message: "Logo uploaded successfully", logo: logoPath });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
