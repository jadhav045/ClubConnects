import mongoose, { Schema } from "mongoose";

const FacultySchema = new mongoose.Schema(
	{
		department: { type: String },
		dateOfJoining: { type: Date },
		designation: { type: String }, // Professor, Associate Professor, etc.

		qualifications: [{ type: String }], // List of academic qualifications (PhD, Masters, etc.)
		researchAreas: [{ type: String }], // List of faculty’s research areas
		teachingSubjects: [{ type: String }], // List of subjects taught by the faculty member

		createdClub: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Club",
			},
		],

		publications: [
			{
				title: { type: String },
				journal: { type: String },
				date: { type: Date },
				url: { type: String }, // URL to the publication
			},
		],

		skills: [{ type: String }],

		announcements: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Announcement",
			},
		],

		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		college: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Collge",
			required: true,
		},
		subRole: {
			type: String,
			enum: [
				"Head of Department",
				"Senior Faculty",
				"Junior Faculty",
				"Advisor",
				"Coordinator",
				"Mentor",
			],
			default: "Junior Faculty",
		},
	},
	{ timestamps: true }
);

export const Faculty = mongoose.model("Faculty", FacultySchema);
