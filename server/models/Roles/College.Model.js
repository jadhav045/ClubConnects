import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		collegeCode: { type: String, unique: true },
		universityAffiliation: { type: String },
		ranking: { type: Number },
		accreditationDetails: { body: String, grade: String },

		logo: { type: String },
		description: { type: String },

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

		establishedYear: { type: Number },

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
		newsUpdates: [
			{
				title: { type: String },
				description: { type: String },
				date: { type: Date, default: Date.now },
				link: { type: String },
			},
		],

		// Performance Tracking
		performanceMetrics: {
			placementRate: { type: Number, default: 0 },
			researchPapersPublished: { type: Number, default: 0 },
			facultyStudentRatio: { type: Number, default: 0 },
		},

		adminDetails: {
			createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
			createdAt: { type: Date, default: Date.now },
			updatedAt: { type: Date, default: Date.now },
		},
	},
	{ timestamps: true }
);

export const College = mongoose.model("College", CollegeSchema);
