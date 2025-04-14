import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema(
	{
		logo: { type: String },
		description: { type: String },

		name: { type: String, required: true, unique: true },
		collegeCode: { type: String, unique: true },
		universityAffiliation: { type: String },
		ranking: { type: Number },
		accreditationDetails: { body: String, grade: String },
		establishedYear: { type: Number },

		address: {
			street: { type: String },
			city: { type: String },
			state: { type: String },
			country: { type: String },
			zipCode: { type: String },
		},

		contactInfo: {
			phoneNumber: { type: String },
			email: { type: String },
			website: { type: String },
		},

		// User Management
		collegeAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		studentCount: { type: Number, default: 0 },
		facultyCount: { type: Number, default: 0 },

		// Campus Infrastructure
		campusArea: { type: Number },
		hostelsAvailable: { type: Boolean, default: false },
		libraryDetails: { booksCount: Number, digitalAccess: Boolean },
		labs: [{ type: String }],

		// Social Links
		socialLinks: {
			linkedIn: { type: String },
			twitter: { type: String },
			facebook: { type: String },
			instagram: { type: String },
		},

		// Announcements & News
		// announcements: [
		// 	{
		// 		type: mongoose.Schema.Types.ObjectId,
		// 		ref: "Announcement",
		// 	},
		// ],

		// Performance Tracking
		performanceMetrics: {
			placementRate: { type: Number, default: 0 },
			researchPapersPublished: { type: Number, default: 0 },
			facultyStudentRatio: { type: Number, default: 0 },
		},

		adminDetails: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

export const College = mongoose.model("College", CollegeSchema);
