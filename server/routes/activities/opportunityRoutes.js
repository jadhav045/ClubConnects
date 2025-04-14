import express from "express";
import {
	createOpportunity,
	getOpportunities,
	deleteOpportunity,
	advanceToNextRound,
	getRoundStudents,
} from "../../controllers/Postings/opportunity.controller.js";
import { authMiddleware } from "../../middlewares/auth.Middleware.js";

const router = express.Router();
// 67e7763986b0979a44b47722
router.post("/", authMiddleware, createOpportunity);
router.get("/", getOpportunities);
router.delete("/:opportunityId", authMiddleware, deleteOpportunity);
router.post(
	"/:opportunityId/advance-round",
	authMiddleware,
	advanceToNextRound
);

router.get(
	"/:opportunityId/round/:roundNumber/students",
	authMiddleware,
	getRoundStudents
);
export default router;
