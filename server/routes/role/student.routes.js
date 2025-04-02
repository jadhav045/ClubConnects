// Here we are gonna implement the features that belongs to the student

import express from "express";
import { authMiddleware } from "../../middlewares/auth.Middleware.js";
import { roleMiddleware } from "../../middlewares/role.Middleware.js";
import {
	updateClubProfileFn,
	updateStudentAlumniProfileFn,
} from "../../controllers/profile.Controller.js";
import {
	createEvent,
	getAllEvents,
} from "../../controllers/Postings/event.controller.js";
import {
	getClubs,
	getGivenClub,
	updateClub,
} from "../../controllers/Roles/student.controller.js";

const router = express();

router.put(
	"/update/student/:studentAlumniId",
	authMiddleware,
	roleMiddleware(["Alumni", "Student"]),
	updateStudentAlumniProfileFn
);

// router.post("/event/create", createEvent);

router.post("/event/create", createEvent);
router.get("/event/list", getAllEvents);

router.get("/clubs", getClubs);
router.get("/club/:clubId", authMiddleware, getGivenClub);
router.put("/club/:clubId", authMiddleware, updateClub);
export default router;
