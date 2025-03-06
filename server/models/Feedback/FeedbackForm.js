import mongoose from "mongoose";

const feedbackFormSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true }, // e.g., "Post-Event Feedback"
		createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true }, // Admin/Organizer
		type: { type: String, enum: ["Event", "Club"], required: true }, // Feedback for what?
		referenceId: { type: mongoose.Types.ObjectId, required: true }, // Event or Club ID
		questions: [
			{
				questionText: { type: String, required: true }, // Question
				questionType: {
					type: String,
					enum: ["Text", "Rating", "MCQ"],
					required: true,
				},
				options: [String], // Only for MCQs
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("FeedbackForm", feedbackFormSchema);
