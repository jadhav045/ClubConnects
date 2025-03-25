import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.Model.js";
import { StudentAlumni } from "../models/Roles/StudentAlumni.Model.js";

const JWT_SECRET = "your_jwt_secret_key"; // Replace with your secret key

export const register = async (req, res) => {
	console.log("BakendCall at Register", req.body);
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

	try {
		const user = await User.findOne({
			$or: [{ email: emailOrPrn }, { prn: emailOrPrn }],
		}).then((user) => {
			if (user && user.role !== "Admin") {
				return User.populate(user, { path: "profileId" });
			}
			return user;
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const payload = {
			id: user._id,
			role: user.role,
			profileId: user.profileId,
		};

		// Add collegeId only if the role is "Faculty"
		if (user.role === "Faculty" && user.profileId?.college) {
			payload.collegeId = user.profileId.college;
		}

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		// Set token as a cookie
		res.cookie("token", token, {
			httpOnly: true, // Prevents JavaScript access to cookie
			secure: process.env.NODE_ENV === "production", // Secure in production (HTTPS)
			sameSite: "strict", // CSRF protection
			maxAge: 3600000, // 1 hour expiration
		});

		res
			.status(200)
			.json({ message: "Login successful", user, token, success: true });
	} catch (error) {
		res.status(500).json({ message: "Login failed", error: error.message });
	}
};

export const logout = (req, res) => {
	res.clearCookie("token", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});
	res.status(200).json({ message: "Logout successful" });
};

// Let me know if you’d like me to refine anything or add more features! 🚀
