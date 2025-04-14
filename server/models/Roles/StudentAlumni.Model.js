import mongoose, { Schema } from "mongoose";

const StudentAlumniSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		role: {
			type: String,
			enum: ["Student", "Alumni"],
			required: true,
		},

		department: { type: String },
		graduationYear: { type: Number },
		enrollmentYear: { type: Number },
		cgpa: { type: Number, min: 0, max: 10 },

		// Common Fields
		skills: [{ type: String }],

		clubsJoined: [
			{
				clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
				role: {
					type: String,
					enum: [
						"Club Mentor", // for alumni
						"President",
						"Vice President",
						"Secretary",
						"Treasurer",
						"Event Coordinator",
						"Marketing Officer",
						"Content Manager",
						"Member Relations Officer",
						"Supporter",
					],
					default: "Supporter",
				},
				joinedDate: { type: Date, default: Date.now },
			},
		],

		// Student-Specific Fields
		internships: [
			{
				title: { type: String },
				company: { type: String },
				location: { type: String },
				duration: { type: String },
				isCurrent: { type: Boolean, default: false },
			},
		],
		// alumni
		availableForMentorship: { type: Boolean, default: false },
		areasOfExpertise: [String], // eg: "Web Dev", "AI", "Design"
		// student
		mentorshipRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

		jobs: [
			{
				title: { type: String },
				company: { type: String },
				location: { type: String },
				duration: { type: String },
				isCurrent: { type: Boolean, default: false },
			},
		],
	},
	{ timestamps: true }
);

export const StudentAlumni = mongoose.model(
	"StudentAlumni",
	StudentAlumniSchema
);
