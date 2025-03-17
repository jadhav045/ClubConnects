import express from "express";
import mongoose from "mongoose";
import { Form } from "../models/Form/Form.js";
import { Response } from "../models/Form/Response.js";

const router = express.Router();

router.post("/create", async (req, res) => {
	console.log("Ar backend");
	try {
		const {
			entityType,
			entityId,
			formType,
			title,
			questions,
			createdBy,
			creatorType,
		} = req.body;

		console.log("BAc", req.body);
		// Validate required fields
		if (
			!entityType ||
			!entityId ||
			!formType ||
			!title ||
			!questions.length ||
			!createdBy ||
			!creatorType
		) {
			return res.status(400).json({ error: "All fields are required" });
		}

		// Ensure valid formType
		if (!["REGISTRATION", "FEEDBACK"].includes(formType)) {
			return res.status(400).json({ error: "Invalid form type" });
		}

		// Ensure valid creatorType
		if (!["User", "Club"].includes(creatorType)) {
			return res.status(400).json({ error: "Invalid creator type" });
		}

		const existingForm = await Form.findOne({
			entityType,
			entityId,
			formType,
		});

		if (existingForm) {
			return res.status(400).json({
				error: `This ${entityType.toLowerCase()} already has a ${formType.toLowerCase()} form`,
			});
		}
		const newForm = new Form({
			entityType,
			entityId,
			formType,
			title,
			questions,
			createdBy,
			creatorType,
		});

		await newForm.save();
		return res
			.status(201)
			.json({ message: `${formType} Form Created`, form: newForm });
	} catch (error) {
		if (error.code === 11000) {
			// Handle duplicate key error from MongoDB unique index
			return res.status(400).json({
				error: "This event already has a form of this type.",
			});
		}
		res.status(500).json({ error: "Server Error", details: error.message });
	}
});

router.post("/submit", async (req, res) => {
	try {
		const { formId, entityType, entityId, userId, answers } = req.body;
		// Validate input fields
		if (!formId || !entityType || !entityId || !userId || !answers.length) {
			return res.status(400).json({ error: "All fields are required" });
		}

		// Check if the form exists
		const form = await Form.findById(formId);
		if (!form) {
			return res.status(404).json({ error: "Form not found" });
		}

		// Prevent duplicate submissions
		const existingResponse = await Response.findOne({
			form: formId,
			user: userId,
		});
		console.log(existingResponse);
		if (existingResponse) {
			return res
				.status(400)
				.json({ error: "You have already submitted this form" });
		}

		// Create a new response
		const newResponse = new Response({
			form: formId,
			entityType,
			entityId,
			user: userId,
			answers,
		});

		await newResponse.save();

		// Determine the response message based on form type
		const message =
			form.formType === "REGISTRATION"
				? "Registration Form Submitted"
				: "Feedback Form Submitted";

		return res.status(201).json({ message, response: newResponse });
	} catch (error) {
		res.status(500).json({ error: "Server Error", details: error.message });
	}
});

// controllers/form.controller.js
const getEntityForms = async (req, res) => {
	try {
		console.log("getEntityForms", req.body);
		const { entityType, entityId } = req.params;
		const { formType } = req.query;

		console.log(req.body);
		// Validate entity parameters
		if (!entityType || !entityId) {
			return res.status(400).json({ error: "Missing entity parameters" });
		}

		if (!["Event", "Opportunity"].includes(entityType)) {
			return res.status(400).json({ error: "Invalid entity type" });
		}

		if (!mongoose.Types.ObjectId.isValid(entityId)) {
			return res.status(400).json({ error: "Invalid entity ID format" });
		}

		// Validate and parse formType parameter
		const validFormTypes = ["REGISTRATION", "FEEDBACK"];
		const requestedTypes = formType ? formType.split(",") : validFormTypes;

		const invalidTypes = requestedTypes.filter(
			(t) => !validFormTypes.includes(t)
		);
		if (invalidTypes.length > 0) {
			return res.status(400).json({
				error: `Invalid form type(s): ${invalidTypes.join(", ")}`,
			});
		}

		// Find requested forms in a single query
		const forms = await Form.find({
			entityType,
			entityId,
			formType: { $in: requestedTypes },
		});

		// If only one form type is requested, return it directly
		if (requestedTypes.length === 1) {
			const form = forms.find((f) => f.formType === requestedTypes[0]);
			return res.status(200).json({
				success: true,
				form: form || null, // Return null if not found
			});
		}

		console.log(forms);
		// If multiple form types are requested, return them in an object
		const result = requestedTypes.reduce((acc, type) => {
			acc[type.toLowerCase()] = forms.find((f) => f.formType === type) || null;
			return acc;
		}, {});

		return res.status(200).json({
			success: true,
			form: result,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Server Error",
			details: error.message,
		});
	}
};

router.get("/:entityType/:entityId/:formType", async (req, res) => {
	try {
		const { entityType, entityId, formType } = req.params;
		console.log(req.params);

		// Validate entityId as a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(entityId)) {
			return res.status(400).json({ message: "Invalid entity ID" });
		}

		// Ensure entityType is either Opportunity or Event
		if (!["Opportunity", "Event"].includes(entityType)) {
			return res.status(400).json({ message: "Invalid entity type" });
		}

		// Find the form associated with the entity and form type
		const form = await Form.findOne({ entityType, entityId, formType }).lean();

		if (!form) {
			return res.status(404).json({ message: "Form not found" });
		}

		// Find all responses for this form and populate user details
		const responses = await Response.find({ form: form._id })
			.populate("user", "name email")
			.lean(); // Use lean() for better performance

		// If no responses found, return empty array
		if (!responses.length) {
			return res
				.status(200)
				.json({ message: "No responses found", responses: [] });
		}

		// Map responses to include questions and answers
		const result = responses.map((response) => {
			const userDetails = {
				userId: response.user?._id,
				name: response.user?.name || "Unknown",
				email: response.user?.email || "Unknown",
			};

			// Match answers with their corresponding questions
			const answersWithQuestions = response.answers.map((answer) => {
				const question = form.questions.find(
					(q) => q._id.toString() === answer.questionId.toString()
				);

				return {
					questionText: question?.questionText || "Question deleted",
					questionType: question?.questionType || "Unknown",
					answer: answer.value,
				};
			});

			return {
				user: userDetails,
				answers: answersWithQuestions,
				submittedAt: response.createdAt,
			};
		});

		res.status(200).json(result);
	} catch (error) {
		console.error("Error fetching responses:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

router.get("/:entityType/:entityId", getEntityForms);
export default router;
