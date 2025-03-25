import express from "express";
import mongoose from "mongoose";
import { Form } from "../models/Form/Form.js";
import { Response } from "../models/Form/Response.js";
import { Event } from "../models/Postings/Event.Model.js";
import { User } from "../models/User.Model.js";

const router = express.Router();

router.post("/create", async (req, res) => {
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

		// Check if the entity type is valid
		if (!["Event", "Opportunity"].includes(entityType)) {
			return res.status(400).json({ error: "Invalid entity type" });
		}

		let EntityModel = "";
		if (entityType === "Event") {
			EntityModel = Event;
		} else {
			EntityModel = Opportunity;
		}
		console.log("MODEL", EntityModel);
		const entity = await EntityModel.findById(entityId);
		if (!entity) {
			return res.status(404).json({ error: `${entityType} not found` });
		}

		// Ensure the entity does not already have a form of this type
		if (
			(formType === "REGISTRATION" && entity.registrationForm) ||
			(formType === "FEEDBACK" && entity.feedbackForm)
		) {
			return res.status(400).json({
				error: `This ${entityType.toLowerCase()} already has a ${formType.toLowerCase()} form`,
			});
		}

		// Create the form
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

		// Update the entity with the form reference
		if (formType === "REGISTRATION") {
			entity.registrationForm = newForm._id;
		} else if (formType === "FEEDBACK") {
			entity.feedbackForm = newForm._id;
		}

		await entity.save();

		return res
			.status(201)
			.json({ message: `${formType} Form Created`, form: newForm });
	} catch (error) {
		console.error("Server Error:", error); // Log full error details
		if (error.code === 11000) {
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

		console.log(req.body);
		if (!formId || !entityType || !entityId || !userId || !answers.length) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const form = await Form.findById(formId);
		if (!form) {
			return res.status(404).json({ error: "Form not found" });
		}

		// Prevent duplicate submissions
		const existingResponse = await Response.findOne({
			form: formId,
			user: userId,
		});

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

		// If the form is a registration form, update the User model
		if (form.formType === "REGISTRATION") {
			const user = await User.findById(userId);
			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			// Add eventId to eventsParticipated if not already present
			if (!user?.eventParticipated?.includes(entityId)) {
				user?.eventParticipated?.push(entityId);
				await user.save();
			}
		}
		await newResponse.save();

		const message =
			form.formType === "REGISTRATION"
				? "Registration Form Submitted"
				: "Feedback Form Submitted";

		return res
			.status(201)
			.json({ message, response: newResponse, success: true });
	} catch (error) {
		console.error("Error in /submit:", error); // Log error for debugging

		// Handle specific error cases
		if (error.name === "ValidationError") {
			return res
				.status(400)
				.json({ error: "Validation error", details: error.message });
		}

		if (error.name === "CastError") {
			return res
				.status(400)
				.json({ error: "Invalid ID format", details: error.message });
		}

		// Generic server error
		return res
			.status(500)
			.json({ error: "Server Error", details: error.message });
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

		// console.log(forms);
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
