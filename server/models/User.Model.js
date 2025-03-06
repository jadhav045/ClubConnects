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
		role: {
			type: String,
			enum: ["Student", "Faculty", "Alumni", "Admin"],
		},

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

		profileId: {
			type: mongoose.Schema.Types.ObjectId,
			refPath: "role",
		},
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
