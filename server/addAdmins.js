import mongoose from "mongoose";
import { User } from "./models/User.Model.js"; 
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Event } from "./models/Postings/Event.Model.js";
dotenv.config({});

mongoose
	.connect("mongodb+srv://mrshaktiman01:dqMMTEbSiUXPFyW6@cluster0.6svacrz.mongodb.net/")
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log("DB Connection Error:", err));

const addAdminFn = async () => {
	try {
		const realPassword = "Admin@1234"; // Real password
		const hashedPassword = await bcrypt.hash(realPassword, 10);

		const adminData = {
			fullName: "Admin User",
			prn: "ADMIN001",
			email: "admin@example.com",
			password: hashedPassword, // Hashed password stored
			role: "Admin",
			branch: "Admin Department",
			profilePicture: "",
			phoneNumber: "1234567890",
			gender: "Male",
			dateOfBirth: new Date("1990-01-01"),
			socialLinks: {},
			posts: [],
			saved: [],
			address: {
				street: "Admin Street",
				city: "Admin City",
				state: "Admin State",
				zipCode: "000000",
				country: "Admin Land",
			},
			awards: [],
			socketId: "",
			notifications: [],
			profileId: null,
			createdFaculty: [],
			createdCollege: [],
		};

		

		const existingAdmin = await User.findOne({ email: adminData.email });
		if (existingAdmin) {
			console.log("Admin already exists");
			return;
		}

		const newAdmin = new User(adminData);
		await newAdmin.save();
		console.log("Admin added successfully with password:", realPassword);
	} catch (error) {
		console.error("Error adding admin:", error);
	} finally {
		mongoose.connection.close();
	}
};

addAdminFn()