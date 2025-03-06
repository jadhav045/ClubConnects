import express from "express";

import {
	assignRoleFn,
	createClubFn,
} from "../../controllers/Roles/faculty.controller.js";
import {
	updateCollegeProfile,
	updateFacultyProfileFn,
} from "../../controllers/profile.Controller.js";
import { authMiddleware } from "../../middlewares/auth.Middleware.js";
import { roleMiddleware } from "../../middlewares/role.Middleware.js";

const router = express();

router.post("/assignRoles/:facultyId", assignRoleFn);
router.post("/create/club/:facultyId", createClubFn);
// Update college profile (Faculty only)
router.put(
	"/update/collge/:id",
	// authMiddleware,
	// roleMiddleware(["Faculty"]),
	updateCollegeProfile
);

router.put(
	"/update/faculty/:facultyId",
	// authMiddleware,
	// roleMiddleware(["Admin", "Faculty"]),
	updateFacultyProfileFn
);
export default router;
