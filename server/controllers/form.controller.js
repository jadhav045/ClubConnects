import express from "express";
import mongoose from "mongoose";
import { Form } from "../models/Form/Form.js";
import { Response } from "../models/Form/Response.js";
import { Event } from "../models/Postings/Event.Model.js";
import { User } from "../models/User.Model.js";
import { Opportunity } from "../models/Postings/Opportunity.js";
import { authMiddleware } from "../middlewares/auth.Middleware.js";

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

		// console.log(req.body);
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

router.post("/submit", authMiddleware, async (req, res) => {
	try {
		console.log("REQ.BPDY", req.body);
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

		if (entityType === "Event") {
			const event = await Event.findById(entityId); // Don't wrap `entityId` in {}
			if (event) {
				event.participants.push(req.user.id);
				await event.save(); // Don't forget to save the changes
			}
		}

		if (entityType === "Opportunity") {
			const opportunity = await Opportunity.findById(entityId);
			if (opportunity) {
				opportunity.participants.push(req.user.id);
				await opportunity.save();
			}
		}
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

const getEntityForms = async (req, res) => {
	try {
		const { entityType, entityId } = req.params;
		const { formType } = req.query;

		// Validate entity parameters with early return
		const validationError = validateEntityParams(entityType, entityId);
		if (validationError) {
			console.log("Validation error:", validationError);
			return res.status(400).json(validationError);
		}

		// Validate form types with early return
		const { requestedTypes, error: formTypeError } =
			validateFormTypes(formType);
		if (formTypeError) {
			// console.log("Form type error:", formTypeError);
			return res.status(400).json(formTypeError);
		}

		const forms = await Form.find({
			entityType,
			entityId,
			formType: { $in: requestedTypes },
		}).lean(); // Use lean() for better performance

		if (requestedTypes.length === 1) {
			const form = forms.find((f) => f.formType === requestedTypes[0]);
			const response = {
				success: form ? true : false,
				...(form
					? {
							form,
							questions: form.questions || [], // Add questions explicitly
					  }
					: {
							message: `No ${
								requestedTypes[0]
							} form found for this ${entityType.toLowerCase()}`,
					  }),
			};

			return res.status(form ? 200 : 404).json(response);
		}

		// Multiple form types request
		const formattedResult = requestedTypes.reduce((acc, type) => {
			acc[type.toLowerCase()] = forms.find((f) => f.formType === type) || null;
			return acc;
		}, {});

		const response = {
			success: true,
			forms: formattedResult,
		};

		return res.status(200).json(response);
	} catch (error) {
		console.error("Error in getEntityForms:", error);
		return res.status(500).json({
			success: false,
			error: "Server Error",
			details: error.message,
		});
	}
};

// Helper function to validate entity parameters
const validateEntityParams = (entityType, entityId) => {
	if (!entityType || !entityId) {
		return { error: "Missing entity parameters" };
	}

	if (!["Event", "Opportunity"].includes(entityType)) {
		return { error: "Invalid entity type" };
	}

	if (!mongoose.Types.ObjectId.isValid(entityId)) {
		return { error: "Invalid entity ID format" };
	}

	return null;
};

// Helper function to validate form types
const validateFormTypes = (formType) => {
	const validFormTypes = ["REGISTRATION", "FEEDBACK"];
	const requestedTypes = formType ? formType.split(",") : validFormTypes;

	const invalidTypes = requestedTypes.filter(
		(t) => !validFormTypes.includes(t)
	);
	if (invalidTypes.length > 0) {
		return {
			error: `Invalid form type(s): ${invalidTypes.join(", ")}`,
			requestedTypes: null,
		};
	}

	return { requestedTypes, error: null };
};

// Export the controller
const getResposne = async (req, res) => {
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
					questionId: question?._id,
				};
			});

			// console.log(answersWithQuestions);
			// console.log(userDetails);

			return {
				user: userDetails,
				answers: answersWithQuestions,
				submittedAt: response.createdAt,
			};
		});

		return res.status(200).json(result);
	} catch (error) {
		console.error("Error fetching responses:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
// Update the route
router.get("/:entityType/:entityId", getEntityForms);

// Response
router.get("/:entityType/:entityId/:formType", getResposne);

// export { getEntityForms };
export default router;
