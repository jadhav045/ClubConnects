import express from "express";
import {
	downloadEventReport,
	generatePassage,
	getEventReportById,
	getOrGenerateQuestions,
	listReports,
	submitEventReport,
} from "../../controllers/Postings/eventReport.controller.js";

const router = express.Router();

router.post("/questions", getOrGenerateQuestions);
router.post("/submit/:id", submitEventReport);
router.get("/report/:id", getEventReportById);
router.get("/list", listReports);
router.get("/report/:id/download", downloadEventReport);
router.post("/passage/:id", generatePassage);
export default router;
