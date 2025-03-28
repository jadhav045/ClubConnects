import { Opportunity } from "../../models/Postings/Opportunity.js";
import {User} from "../../models/User.Model.js";
export const createOpportunity = async (req, res) => {
	try {
		const {
			title,
			description,
			opportunityType,
			eligibilityCriteria,
			applicationDeadline,
			attachments,
		} = req.body;

		// Validation
		if (!title || !description || !opportunityType || !applicationDeadline) {
			return res.status(400).json({
				message:
					"Title, description, opportunity type, and application deadline are required.",
			});
		}

		if (new Date(applicationDeadline) <= new Date()) {
			return res.status(400).json({
				message: "Application deadline must be in the future.",
			});
		}

		const validOpportunityTypes = [
			"INDUSTRY_PROJECT",
			"INTERNSHIP",
			"JOB",
			"RESEARCH",
			"OTHER",
		];
		if (!validOpportunityTypes.includes(opportunityType)) {
			return res.status(400).json({
				message: "Invalid opportunity type.",
			});
		}

		// Create new opportunity
		const newOpportunity = new Opportunity({
			postedBy: req.user.id,
			userRole: req.user.role,
			title,
			description,
			opportunityType,
			eligibilityCriteria: eligibilityCriteria || {},
			applicationDeadline,
			opportunityStatus: "OPEN",
			attachments: attachments || [],
			
		});

		const savedOpportunity = await newOpportunity.save();

		await User.findByIdAndUpdate(req.user.id, {
			$push: { opportunities: savedOpportunity._id },
		});

		return res.status(201).json({
			message: "Opportunity created successfully",
			opportunity: savedOpportunity,
		});
	} catch (err) {
		console.error("Error creating opportunity:", err);
		res.status(500).json({
			message: "Server error",
			error: err.message,
		});
	}
};



