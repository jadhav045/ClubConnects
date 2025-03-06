// Here we are gonna implement the features that belongs to the student

import express from "express";
import { authMiddleware } from "../../middlewares/auth.Middleware.js";
import { roleMiddleware } from "../../middlewares/role.Middleware.js";
import { updateClubProfileFn, updateStudentAlumniProfileFn } from "../../controllers/profile.Controller.js";

const router = express();

router.put(
	"/update/student/:studentAlumniId",
	authMiddleware,
	roleMiddleware(["Alumni", "Student"]),
	updateStudentAlumniProfileFn
);

router.put(
	"/update/club/:clubId",
	authMiddleware,
	// roleMiddleware(["Alumni", "Student"]),
	// update will by the presidant
	updateClubProfileFn
);

export default router;
