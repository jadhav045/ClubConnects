import mongoose, { Schema } from "mongoose";

const ClubSchema = new mongoose.Schema(
	{
		clubName: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			index: true, // Improves search performance
		},
		shortName: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			index: true,
		},
		motto: { type: String, trim: true },
		description: { type: String, trim: true },
		logo: { type: String },
		profilePicture: { type: String },

		socialMedia: {
			facebook: { type: String, trim: true },
			instagram: { type: String, trim: true },
			linkedin: { type: String, trim: true },
			twitter: { type: String, trim: true }, // Removed extra "A"
			website: { type: String, trim: true },
		},

		// **Membership & Structure**
		members: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				role: {
					type: String,
					enum: [
						"Admin", // New role for club-level management
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

		advisors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		maxMembers: { type: Number, default: 100 },
		membershipFee: { type: Number, default: 0 },
		eligibilityCriteria: { type: String, trim: true },

		// **Club History & Achievements**
		foundingYear: { type: Number },
		foundingMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		pastLeaders: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				role: { type: String },
				tenureStart: { type: Date },
				tenureEnd: { type: Date },
			},
		],
		achievements: [
			{
				title: { type: String, required: true },
				description: { type: String, trim: true },
				date: { type: Date },
				image: { type: String },
			},
		],
		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
		saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

		// **Events & Activities**
		events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
		collaborations: [
			{
				clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
				eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
				details: { type: String, trim: true },
			},
		],

		// **Resource & Document Management**
		documents: [
			{
				title: { type: String, required: true },
				fileUrl: { type: String, required: true },
				uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				uploadedAt: { type: Date, default: Date.now },
			},
		],

		// **Administrative Details**
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		collegeId: { type: Schema.Types.ObjectId, ref: "College", required: true },
		status: {
			type: String,
			enum: ["Active", "Inactive", "Pending Approval"],
			default: "Active",
			index: true,
		},
		requests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Request",
			},
		],
	},
	{ timestamps: true }
);

export const Club = mongoose.model("Club", ClubSchema);
