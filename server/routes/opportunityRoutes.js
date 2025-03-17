import express from "express";
import { authMiddleware } from "../middlewares/auth.Middleware.js";
import { createOpportunity } from "../controllers/opportunityController.js";
const router = express();

router.post("/create",authMiddleware, createOpportunity);

export default router;
