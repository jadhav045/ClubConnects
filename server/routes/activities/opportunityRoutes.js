import express from "express";
import {
	createOpportunity,
	submitStudentApplication,
	processRoundEvaluation,
	proceedToNextRound,
	closeOpportunitySelection,
} from "../../controllers/Postings/opportunity.controller.js";
import { authMiddleware } from "../../middlewares/auth.Middleware.js";

const router = express.Router();
// 67e7763986b0979a44b47722
router.post("/", authMiddleware, createOpportunity);

// router.post("/", authMiddleware, postNewOpportunity);
router.post("/:opportunityId/apply", authMiddleware, submitStudentApplication);
router.put("/evaluate/:applicationId", authMiddleware, processRoundEvaluation);
router.put("/:opportunityId/next-round", authMiddleware, proceedToNextRound);
router.put("/:opportunityId/close", authMiddleware, closeOpportunitySelection);

export default router;
