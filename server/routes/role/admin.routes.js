// college.Routes.js
import express from "express";

import { roleMiddleware } from "../../middlewares/role.Middleware.js";

import { authMiddleware } from "../../middlewares/auth.Middleware.js";
import {
	createCollege,
	createFacultyFn,
	getAllCollegeList,
	getAllFacultiesList,
	getAllUsers,
} from "../../controllers/Roles/admin.controller.js";

const router = express.Router();

// Create college (Admin only)
router.post(
	"/create/college",
	authMiddleware,
	// roleMiddleware(["Admin"]),
	createCollege
);

router.post(
	"/create/faculty/:collegeId",
	authMiddleware,
	roleMiddleware(["Admin", "Faculty"]),
	createFacultyFn
);

router.get(
	"/faculty/list/:collegeId",
	authMiddleware,
	roleMiddleware(["Admin", "Faculty"]),
	getAllFacultiesList
);

router.get(
	"/college/list",
	authMiddleware,
	roleMiddleware(["Admin"]),
	getAllCollegeList
);

router.get("/users/list",  getAllUsers);
export default router;
