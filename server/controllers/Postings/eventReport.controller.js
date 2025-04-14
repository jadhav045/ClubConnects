import { Event } from "../../models/Postings/Event.Model.js";
import EventTemplate from "../../models/Postings/EventTemplate.js";
import {
	generateSmartParagraphsFromReport,
	getGeminiQuestions,
} from "../../services..js/gemini.service.js";
import { generateReportPDF } from "../../utils/generateReportPDF.js";

// STEP 1: Generate or reuse questions for given eventType
export const getOrGenerateQuestions = async (req, res) => {
	const { eventType, summary } = req.body;

	// Check if template exists
	let template = await EventTemplate.findOne({ eventType });

	if (!template) {
		// Call Gemini to generate new questions
		const questions = await getGeminiQuestions(eventType, summary);
		template = await EventTemplate.create({ eventType, questions });
	}

	res.status(200).json(template.questions);
};

// STEP 2: Save filled event repor
export const submitEventReport = async (req, res) => {
	const { id } = req.params;
	const { report, images, summary } = req.body;

	const updated = await Event.findByIdAndUpdate(
		id,
		{
			report,
			summary,
			images,
		},
		{ new: true }
	);

	if (!updated) return res.status(404).json({ message: "Event not found" });

	res.status(200).json({ message: "Report added to event", event: updated });
};

// STEP 3: Get report by ID (for preview, PDF, etc.)
export const getEventReportById = async (req, res) => {
	const { id } = req.params;
	const report = await Event.findById(id);
	if (!report) return res.status(404).json({ message: "Not found" });
	res.status(200).json(report);
};

// STEP 4: List reports (optional: by club, eventType)
export const listReports = async (req, res) => {
	const filters = req.query;
	const reports = await Event.find(filters).sort({ createdAt: -1 });
	res.status(200).json(reports);
};

// import { generateReportPDF } from "../utils/generateReportPDF.js";

export const downloadEventReport = async (req, res) => {
	const { id } = req.params;
	const event = await Event.findById(id).populate(
		"organizer",
		"logo clubName title"
	); // only include name & email from organizer
	// include only specific fields from event

	console.log("event", event);
	// console.log("organizer", organizer);
	if (!event) return res.status(404).json({ message: "Event not found" });

	const filePath = `./exports/report-${id}.pdf`;
	await generateReportPDF(event, filePath);

	res.download(filePath, `Event_Report_${event.eventTitle}.pdf`, (err) => {
		if (err) console.error("Download error:", err);
	});
};

export const generatePassage = async (req, res) => {
	const { id } = req.params;
	const event = await Event.findById(id);

	console.log("event", event);
	// console.log("organizer", organizer);
	if (!event) return res.status(404).json({ message: "Event not found" });
	const passage = await generateSmartParagraphsFromReport(
		event.eventType,
		event.report
	);
	return res.json({
		message: "Passage converted successfully",
		passage,
	});
};
