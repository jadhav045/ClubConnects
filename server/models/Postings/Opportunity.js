import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true }, // Opportunity Title
		description: { type: String, required: true, trim: true }, // Detailed Description
		opportunityType: {
			type: String,
			enum: ["INDUSTRY_PROJECT", "INTERNSHIP", "JOB", "RESEARCH", "OTHER"], // Type of Opportunity
			required: true,
		},

		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Alumni or Faculty who posted it
			required: true,
		},

		userRole: {
			type: String,
			enum: ["ALUMNI", "FACULTY"], // Only Alumni or Faculty can post
			required: true,
		},

		eligibilityCriteria: {
			minCGPA: { type: Number, min: 0, max: 10 }, // Minimum CGPA Requirement
			skillsRequired: [{ type: String }], // List of Required Skills
			graduationYear: [{ type: Number }], // Eligible Graduation Years
			departments: [{ type: String }], // Eligible Departments (e.g., CSE, ECE, ME)
		},

		applicationDeadline: { type: Date, required: true }, // Last Date to Apply
		opportunityStatus: {
			type: String,
			enum: ["OPEN", "CLOSED"],
			default: "OPEN",
		},

		applicants: [
			{
				student: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Student who applied
				resume: { type: String }, // Resume URL
				coverLetter: { type: String }, // Cover Letter (Optional)
				appliedAt: { type: Date, default: Date.now }, // Application Timestamp
				status: {
					type: String,
					enum: ["PENDING", "SHORTLISTED", "REJECTED", "SELECTED"],
					default: "PENDING",
				},
			},
		],

		attachments: [
			{
				fileType: {
					type: String,
					enum: ["DOCUMENT", "URL"], // Supporting files (PDFs, Job Descriptions, etc.)
				},
				fileUrl: { type: String, required: true },
			},
		],

		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

export default mongoose.model("Opportunity", opportunitySchema);
