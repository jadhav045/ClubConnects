import mongoose from "mongoose";

const TemplateQuestionSchema = new mongoose.Schema({
	question: String,
	category: String,
});

const EventTemplateSchema = new mongoose.Schema({
	eventType: String,
	questions: [TemplateQuestionSchema],
	createdByAI: { type: Boolean, default: true },
});

export default mongoose.model("EventTemplate", EventTemplateSchema);
