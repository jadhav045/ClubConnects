import mongoose, { Schema } from "mongoose";

const FacultySchema = new mongoose.Schema(
	{
		department: { type: String },
		designation: { type: String }, // Professor, Associate Professor, etc.
		dateOfJoining: { type: Date },
		qualifications: [{ type: String }], // List of academic qualifications (PhD, Masters, etc.)
		researchAreas: [{ type: String }], // List of faculty’s research areas
		teachingSubjects: [{ type: String }], // List of subjects taught by the faculty member
		createaClub: [
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
		expertiseAreas: [{ type: String }], // Specific domains of expertise (AI, Data Science, etc.)
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
