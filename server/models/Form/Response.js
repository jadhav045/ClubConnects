import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
	questionId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Form.questions", // Ensuring reference to a question in Form
	},
	value: { type: mongoose.Schema.Types.Mixed, required: true },
});

const ResponseSchema = new mongoose.Schema(
	{
		form: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Form",
			required: true,
		},
		entityType: {
			type: String,
			enum: ["Event", "Opportunity"], // Helps in filtering responses
			required: true,
		},
		entityId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			refPath: "entityType",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		answers: [AnswerSchema],
	},
	{ timestamps: true }
);

export const Response = mongoose.model("Response", ResponseSchema);