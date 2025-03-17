import mongoose from "mongoose";
import Opportunity from "../models/Postings/Opportunity.js";

export const createOpportunity = async (req, res) => {
	try {
		const {
			title,
			description,
			opportunityType,
			eligibilityCriteria,
			applicationDeadline,
			stages,
			attachments,
			registrationForm,
			postedBy,
		} = req.body;

		// Check required fields
		if (
			!title ||
			!description ||
			!opportunityType ||
			!applicationDeadline ||
			!postedBy
		) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		// Validate application deadline
		const deadline = new Date(applicationDeadline);
		if (isNaN(deadline.getTime())) {
			return res
				.status(400)
				.json({ message: "Invalid application deadline date" });
		}
		if (deadline < new Date()) {
			return res
				.status(400)
				.json({ message: "Application deadline must be in the future" });
		}

		// Get user info from auth middleware
		const userId = req.user._id;
		const userRole = req.user.role;

		console.log(req.user);

		// Check user role permission
		if (!["Alumni", "Faculty"].includes(userRole)) {
			return res
				.status(403)
				.json({ message: "Unauthorized to create opportunity" });
		}

		// Create new opportunity instance
		const newOpportunity = new Opportunity({
			title,
			description,
			opportunityType,
			postedBy: userId,
			userRole,
			eligibilityCriteria: eligibilityCriteria || {},
			applicationDeadline: deadline,
			stages: stages || 1,
			attachments: attachments || [],
			registrationForm: registrationForm || null,
			createdBy: userId,
			postedBy,
		});

		// Save to database
		await newOpportunity.save();

		res.status(201).json(newOpportunity);
	} catch (error) {
		// Handle validation errors from Mongoose
		if (error.name === "ValidationError") {
			return res.status(400).json({ message: error.message });
		}
		console.error("Error creating opportunity:", error);
		res.status(500).json({ message: "Server error creating opportunity" });
	}
};
