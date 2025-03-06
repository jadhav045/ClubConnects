// college.Routes.js
import express from "express";

import { roleMiddleware } from "../../middlewares/role.Middleware.js";

import { authMiddleware } from "../../middlewares/auth.Middleware.js";
import {
	createCollege,
	createFacultyFn,
} from "../../controllers/Roles/admin.controller.js";

const router = express.Router();

// Create college (Admin only)
router.post(
	"/create/college",
	authMiddleware,
	roleMiddleware(["Admin"]),
	createCollege
);

router.post(
	"/create/faculty/:collegeId",
	authMiddleware,
	roleMiddleware(["Admin", "Faculty"]),
	createFacultyFn
);

export default router;
