import mongoose from "mongoose";

const feedbackResponseSchema = new mongoose.Schema(
	{
		feedbackForm: {
			type: mongoose.Types.ObjectId,
			ref: "FeedbackForm",
			required: true,
		},
		user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
		answers: [
			{
				questionId: { type: mongoose.Types.ObjectId, required: true }, // Refers to a question in FeedbackForm
				answerText: String, // For text answers
				selectedOption: String, // For MCQs
				rating: Number, // For rating-based answers (1-5)
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("FeedbackResponse", feedbackResponseSchema);
