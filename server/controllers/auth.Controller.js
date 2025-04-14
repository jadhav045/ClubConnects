import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.Model.js";
import { StudentAlumni } from "../models/Roles/StudentAlumni.Model.js";

const JWT_SECRET = "your_jwt_secret_key"; // Replace with your secret key

export const register = async (req, res) => {
	// console.log("BakendCall at Register", req.body);
	const { fullName, email, prn, role, password } = req.body;

	try {
		if (!fullName || !email || !prn || !role || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const existingUser = await User.findOne({ $or: [{ email }, { prn }] });
		if (existingUser) {
			return res.status(400).json({ message: "Email or PRN already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const createdUser = await User.create({
			fullName,
			email,
			prn,
			role,
			password: hashedPassword,
		});

		if (!createdUser) {
			throw new Error("User creation failed");
		}

		const studentAlumniProfile = await StudentAlumni.create({
			userId: createdUser._id,
			role,
		});
		if (!studentAlumniProfile) {
			await User.deleteOne({ _id: createdUser._id });
			throw new Error("Student/Alumni profile creation failed");
		}

		createdUser.profileId = studentAlumniProfile._id;
		await createdUser.save();

		res
			.status(201)
			.json({ message: "User registered successfully", user: createdUser });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Registration failed", error: error.message });
	}
};
export const login = async (req, res) => {
	const { emailOrPrn, password } = req.body;

	console.log("Data at Login", req.body);
	try {
		const user = await User.findOne({
			$or: [{ email: emailOrPrn }, { prn: emailOrPrn }],
		}).populate("profileId"); // populate the profileId if it's linked

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// If user is found but is not Admin, and has a profile
		if (user.role !== "Admin" && !user.profileId) {
			return res.status(400).json({ message: "User profile not linked yet" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		console.log(user);

		const payload = {
			id: user?._id,
			role: user?.role,
			profileId: user?.profileId?._id,
		};
		console.log(payload);
		if (user.role === "Faculty" && user.profileId?.college) {
			payload.collegeId = user.profileId.college;
		}
		console.log("JWT_SECRET:", process.env.JWT_SECRET);

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: 86400, // 1 day = 86400 seconds
		});

		// Set token in cookie with correct expiration time
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 24 * 60 * 60 * 1000, // 1 day (matches JWT expiration)
		});

		res
			.status(200)
			.json({ message: "Login successful", user, token, success: true });
	} catch (error) {
		console.log("error", error.message);
		res.status(500).json({ message: "Login failed", error: error.message });
	}
};
export const getUserProfile = async (req, res) => {
	const { userId } = req.params;

	console.log(userId);
	try {
		// Fetch user with only role and profileId initially
		const user = await User.findById(userId).select("role profileId");

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		if (user.role == "Admin") {
			return res.json({ success: true, user });
		}
		// Common population for all users
		const populateOptions = [
			{ path: "profileId" },
			{ path: "posts" },
			{ path: "saved" },
			{ path: "eventParticipated" },
			{ path: "opportunities" },
			{ path: "discussions" },
		];

		// Additional population for Faculty
		if (user.role === "Faculty") {
			populateOptions.push({
				path: "profileId",
				populate: { path: "createdClub" },
			});
		}

		// Fully populate user data
		const populatedUser = await User.findById(userId).populate(populateOptions);

		// Populate clubsJoined for Alumni and Students
		if (
			["Alumni", "Student"].includes(user.role) &&
			populatedUser.profileId?.clubsJoined?.length
		) {
			const populatedClubs = await Club.find({
				_id: {
					$in: populatedUser.profileId.clubsJoined.map((club) => club.clubId),
				},
			}).select("clubName clubDescription");

			// Map back to the original structure
			populatedUser.profileId.clubsJoined =
				populatedUser.profileId.clubsJoined.map((club) => ({
					...club.toObject(), // Keep original properties (e.g., role, joinedDate)
					clubId: populatedClubs.find(
						(c) => c._id.toString() === club.clubId.toString()
					), // Populate clubId with full club details
				}));
		}

		// console.log("Created Club", populatedUser.profileId.createdClub);

		return res.json({ success: true, user: populatedUser });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Server error", error: error.message });
	}
};

export const logout = (req, res) => {
	try {
		console.log("Logging out user...");
		res.clearCookie("token", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});
		console.log("Token cookie cleared successfully.");
		res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		console.error("Error during logout:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
import mongoose from "mongoose";
import { Club } from "../models/Roles/Club.Model.js";
import { Notification } from "../models/Notifications.js";
import uploadImage from "../utils/fileUpload.js";

export const updateUserProfile = async (req, res) => {
	try {
		const userId = req.user.id; // Get authenticated user ID
		let updateData = req.body;

		console.log("At Update", updateData);
		console.log("File", req.file);
		// Ensure `profileId` is valid and exists
		if (
			updateData.profileId &&
			!mongoose.Types.ObjectId.isValid(updateData.profileId)
		) {
			return res.status(400).json({ message: "Invalid profileId" });
		}
		if (req.file) {
			const profilePicture = await uploadImage(req.file);
			console.log("profile", profilePicture?.fileUrl);
			updateData = {
				...req.body,
				profilePicture: profilePicture?.fileUrl, // Ensure only fileUrl is stored
			};
		} else {
			updateData = {
				...req.body,
			};
		}

		// console.log()
		// Update User Profile
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ ...updateData }, // ✅ Spread the updateData object
			{ new: true, runValidators: true }
		);

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}
		console.log("Updated Yser", updatedUser.profilePicture);

		return res.status(200).json({
			message: "Profile updated successfully",
			user: updatedUser,
		});
	} catch (error) {
		console.error("Error updating profile:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Notifications
export const getUserNotifications = async (req, res) => {
	try {
		console.log("Fetching notifications...");

		if (!req.user || !req.user.id) {
			return res
				.status(401)
				.json({ error: "Unauthorized. User ID is missing." });
		}

		const userId = req.user.id;

		const notifications = await Notification.find({ to: userId })
			.sort({ createdAt: -1 })
			.lean();

		if (!notifications.length) {
			return res.status(404).json({ message: "No notifications found." });
		}

		res.json(notifications);
	} catch (error) {
		console.error("Error fetching notifications:", error);
		res.status(500).json({
			error: "Failed to fetch notifications. Please try again later.",
		});
	}
};
export const markAsRead = async (req, res) => {
	try {
		const { notificationId } = req.params;

		if (!notificationId) {
			return res.status(400).json({ error: "Notification ID is required." });
		}

		const updatedNotification = await Notification.findByIdAndUpdate(
			notificationId,
			{ isRead: true },
			{ new: true }
		);

		if (!updatedNotification) {
			return res.status(404).json({ error: "Notification not found." });
		}

		res.json({ success: true, notification: updatedNotification });
	} catch (error) {
		console.error("Error marking notification as read:", error);
		res.status(500).json({ error: "Failed to update notification." });
	}
};
export const markAllAsRead = async (req, res) => {
	try {
		if (!req.user || !req.user.id) {
			return res
				.status(401)
				.json({ error: "Unauthorized. User ID is missing." });
		}

		const userId = req.user.id;

		const result = await Notification.updateMany(
			{ to: userId, isRead: false },
			{ isRead: true }
		);

		if (result.modifiedCount === 0) {
			return res
				.status(404)
				.json({ message: "No unread notifications found." });
		}

		res.json({ success: true, message: "All notifications marked as read." });
	} catch (error) {
		console.error("Error marking all notifications as read:", error);
		res
			.status(500)
			.json({ error: "Internal Server Error. Please try again later." });
	}
};

export const getAlumni = async (req, res) => {
	try {
		const alumni = await StudentAlumni.find({ role: "Alumni" }).populate({
			path: "userId",
			select: "-password", // optional: exclude password or sensitive info
		});

		res.status(200).json({ alumni });
	} catch (error) {
		console.error("Error fetching alumni:", error);
		res
			.status(500)
			.json({ error: "Internal Server Error. Please try again later." });
	}
};
