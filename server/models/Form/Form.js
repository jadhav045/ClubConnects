import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
	questionType: {
		type: String,
		enum: [
			"TEXT",
			"EMAIL",
			"NUMBER",
			"MULTIPLE_CHOICE",
			"CHECKBOX",
			"DROPDOWN",
			"RATING",
			"DATE",
			"TIME",
			"FILE_UPLOAD",
			"URL",
		],
		required: true,
	},
	questionText: {
		type: String,
		required: true,
	},
	options: [String], // For multiple-choice, checkbox, dropdown
	required: {
		type: Boolean,
		default: false,
	},
	order: Number,
});

const FormSchema = new mongoose.Schema(
	{
		entityType: {
			type: String,
			enum: ["Event", "Opportunity"], // Specifies the entity type
			required: true,
		},
		entityId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			refPath: "entityType", // Dynamically references Event or Opportunity
		},
		formType: {
			type: String,
			enum: ["REGISTRATION", "FEEDBACK"], // Allows different types of forms
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		questions: [QuestionSchema],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			refPath: "creatorType", // Dynamically references either "User" or "Club"
			required: true,
		},
		creatorType: {
			type: String,
			enum: ["User", "Club"],
			required: true,
		},
	},
	{ timestamps: true }
);

FormSchema.index({ entityType: 1, entityId: 1, formType: 1 }, { unique: true });

export const Form = mongoose.model("Form", FormSchema);
