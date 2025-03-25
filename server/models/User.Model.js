import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		fullName: { type: String },
		prn: { type: String, unique: true },
		email: {
			type: String,
			required: true,
			unique: true,
			match: /.+\@.+\..+/,
		},
		password: { type: String, required: true },

		branch: { type: String },
		profilePicture: { type: String },
		phoneNumber: { type: String },
		gender: { type: String, enum: ["Male", "Female"] },
		dateOfBirth: { type: Date },
		socialLinks: {
			linkedIn: { type: String, default: "" },
			twitter: { type: String, default: "" },
			github: { type: String, default: "" },
			personalWebsite: { type: String, default: "" },
		},

		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
		saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

		address: {
			street: { type: String },
			city: { type: String },
			state: { type: String },
			zipCode: { type: String },
			country: { type: String },
		},

		awards: [
			{
				title: { type: String },
				description: { type: String },
				date: { type: Date },
				image: { type: String },
			},
		],
		eventParticipated: [{ type: Schema.Types.ObjectId, ref: "Event" }],
		socketId: { type: String },
		notifications: [
			{
				message: { type: String, required: true, trim: true },
				isRead: { type: Boolean, default: false },
				date: { type: Date, default: Date.now },

				type: {
					type: String,
					enum: ["event", "post", "opportunity", "general"],
					default: "general",
				},

				referenceId: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					refPath: "type",
				},
				// Dynamic reference to Event, Post, Opportunity, etc.

				sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				// Who sent the notification (Admin, Faculty, Alumni, etc.)

				url: { type: String }, // Optional: Link to event/opportunity/post
			},
		],

		role: {
			type: String,
			enum: ["Student", "Alumni", "Faculty", "Admin"],
		},

		profileId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: function () {
				if (this.role === "Student" || this.role === "Alumni") {
					return "StudentAlumni"; // Both roles reference the same collection
				}

				return this.role; // Otherwise, reference the exact role collection
			},
		},

		appliedOpportunities: [
			{
				opportunity: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Opportunity",
				},
				status: String,
				stage: Number,
			},
		],
		notifications: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Notification",
			},
		],
		// for only admin
		createdFaculty: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Faculty",
			},
		],
		createdCollege: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "College",
			},
		],
	},

	{ timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
