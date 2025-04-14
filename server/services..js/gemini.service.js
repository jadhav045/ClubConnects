import axios from "axios";

const GEMINI_API_KEY = "AIzaSyCErJZb_5q81tOcEEVQbGpKsloWvSJ4Shk";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
export const getGeminiQuestions = async (eventType, summary) => {
	const prompt = `
Generate 10 report questions for an event of type "${eventType}".
Here is the event summary: "${summary}"

Each question should be suitable for post-event reporting and grouped into one of these categories:
["planning", "execution", "support", "participation", "outcome", "feedback", "suggestions", "problems"]

Respond strictly in JSON array format like:
[
  { "question": "...", "category": "..." },
  ...
]
`;

	try {
		const response = await axios.post(
			`${GEMINI_URL}?key=${GEMINI_API_KEY}`,
			{
				contents: [{ parts: [{ text: prompt }] }],
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		console.log("REPSONSE", response);
		const rawText = response.data.candidates[0].content.parts[0].text;

		const questions = JSON.parse(rawText);
		return questions;
	} catch (error) {
		console.error("Gemini API error:", error?.response?.data || error.message);
		return [
			{ question: "Who planned the event?", category: "planning" },
			{ question: "How many people attended?", category: "participation" },
			{ question: "Were there any challenges?", category: "problems" },
		];
	}
};

// Helper to send prompt to Gemini and get title + paragraph
const generateParagraphFromPrompt = async (prompt) => {
	try {
		const response = await axios.post(
			`${GEMINI_URL}?key=${GEMINI_API_KEY}`,
			{
				contents: [{ parts: [{ text: prompt }] }],
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const rawText = response.data.candidates[0].content.parts[0].text;
		return rawText;
	} catch (error) {
		console.error(
			"Gemini paragraph generation error:",
			error?.response?.data || error.message
		);
		return null;
	}
};

export const generateSmartParagraphsFromReport = async (eventType, report) => {
	const sectionParagraphs = {};

	for (const [category, items] of Object.entries(report)) {
		const qaList = items.map((q, i) => `${i + 1}. ${q.answer}`).join("\n");

		const prompt = `
You are an expert report writer. Your task is to convert the following answers into a professional, single-paragraph summary for a post-event report of a "${eventType}" event.

Answers:
${qaList}

Also suggest a clean, formal title for this section based on the content.

Respond in this format:
Title: <section title>
Paragraph: <polished paragraph>
		`.trim();

		console.log(`Generating paragraph for category: ${category}`);
		const rawResponse = await generateParagraphFromPrompt(prompt);
		console.log("RAWRESPONSE", rawResponse);
		if (rawResponse) {
			const match = rawResponse.match(/Title:\s*(.*)\nParagraph:\s*([\s\S]*)/i);
			if (match) {
				const sectionTitle = match[1].trim();
				const paragraph = match[2].trim();
				sectionParagraphs[sectionTitle] = paragraph;
				continue;
			}
		}

		// fallback if AI response is invalid
		sectionParagraphs[category] = qaList;
	}

	return sectionParagraphs;
};
