import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	resume: {
		type: String,
		required: true,
	},
	currentStatus: {
		type: String,
		enum: ["PENDING", "SHORTLISTED", "REJECTED", "SELECTED"],
		default: "PENDING",
	},
	currentStage: {
		type: Number,
		default: 1,
	},
	statusHistory: [
		{
			stage: Number,
			status: String,
			changedBy: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			date: {
				type: Date,
				default: Date.now,
			},
			feedback: String,
		},
	],
});

const opportunitySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		opportunityType: {
			type: String,
			enum: ["INDUSTRY_PROJECT", "INTERNSHIP", "JOB", "RESEARCH", "OTHER"],
			required: true,
		},
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		userRole: {
			type: String,
			enum: ["Alumni", "Faculty"],
			required: true,
		},
		eligibilityCriteria: {
			minCGPA: {
				type: Number,
				min: 0,
				max: 10,
			},
			skillsRequired: [
				{
					type: String,
				},
			],
			graduationYear: [
				{
					type: Number,
				},
			],
			departments: [
				{
					type: String,
				},
			],
		},
		applicationDeadline: {
			type: Date,
			required: true,
		},
		opportunityStatus: {
			type: String,
			enum: ["OPEN", "CLOSED"],
			default: "OPEN",
		},
		applicants: [applicantSchema],
		stages: {
			type: Number,
			default: 1,
			min: 1,
			max: 5,
		},
		attachments: [
			{
				fileType: {
					type: String,
					enum: ["DOCUMENT", "URL"],
				},
				fileUrl: {
					type: String,
					required: true,
				},
			},
		],
		registrationForm: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Form",
		},
	},
	{
		timestamps: true,
		index: [
			{ "eligibilityCriteria.departments": 1 },
			{ "eligibilityCriteria.graduationYear": 1 },
			{ "applicants.currentStatus": 1 },
			{ "applicants.currentStage": 1 },
		],
	}
);

export const Opportunity = mongoose.model("Opportunity", opportunitySchema);
