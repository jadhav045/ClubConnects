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

		
		address: {
			street: { type: String },
			city: { type: String },
			state: { type: String },
			zipCode: { type: String },
			country: { type: String },
		},
		
		socialLinks: {
			linkedIn: { type: String, default: "" },
			twitter: { type: String, default: "" },
			github: { type: String, default: "" },
			personalWebsite: { type: String, default: "" },
		},
		awards: [
			{
				title: { type: String },
				description: { type: String },
				date: { type: Date },
				image: { type: String },
			},
		],

		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
		saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
		eventParticipated: [{ type: Schema.Types.ObjectId, ref: "Event" }],
		opportunities: [{ type: Schema.Types.ObjectId, ref: "Opportunity" }],
		discussions: [{ type: Schema.Types.ObjectId, ref: "Discussion" }],

		// For - alumni
		eventsHosted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],

		following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],

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
