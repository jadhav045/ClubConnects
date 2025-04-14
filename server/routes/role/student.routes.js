// Here we are gonna implement the features that belongs to the student

import express from "express";
import { authMiddleware } from "../../middlewares/auth.Middleware.js";
import { roleMiddleware } from "../../middlewares/role.Middleware.js";
import { updateStudentAlumniProfileFn } from "../../controllers/profile.Controller.js";
import {
	addReport,
	checkUserFormStatus,
	createEvent,
	getAllEvents,
	giveAttendance,
	openAttendance,
	sendReminder,
} from "../../controllers/Postings/event.controller.js";
import {
	addAchievement,
	assignRole,
	deleteAchievement,
	getClubs,
	getGivenClub,
	toggleFollowClub,
	updateAchievement,
	updateClub,
} from "../../controllers/Roles/student.controller.js";
import upload from "../../middlewares/multer.js";

import {
	handleMentorshipRequest,
	sendMentorshipRequest,
	updateMentorshipAvailability,
} from "../../controllers/Roles/mentor.controller.js";

const router = express();

router.put(
	"/update/student/:studentAlumniId",
	authMiddleware,
	roleMiddleware(["Alumni", "Student"]),
	updateStudentAlumniProfileFn
);

// router.post("/event/create", createEvent);

// router.post("/event/create", upload.array("attachments", 10),createEvent);
router.post(
	"/event/create",
	// upload.array("resources"),
	// authMiddleware,
	createEvent
);

router.get("/event/list", getAllEvents);

router.get("/clubs", getClubs);
router.get("/club/:clubId", authMiddleware, getGivenClub);
router.put("/club/:clubId", upload.single("file"), authMiddleware, updateClub);

router.post("/club/:clubId/follow", authMiddleware, toggleFollowClub);
router.post("/assign-role", assignRole);

router.post(
	"/club/:clubId/achievement",
	upload.single("image"),
	authMiddleware,
	addAchievement
);

// Delete Achievement
router.delete(
	"/club/:clubId/achievement/:achievementId",
	authMiddleware,
	deleteAchievement
);

// Update Achievement
router.put(
	"/club/:clubId/achievement/:achievementId",
	upload.single("image"),
	updateAchievement
);
router.post("/club/sendReminder/:eventId", sendReminder);

// Alumni Mentorship

router.put("/availability", authMiddleware, updateMentorshipAvailability);
router.post("/request", authMiddleware, sendMentorshipRequest);
router.post("/handle", authMiddleware, handleMentorshipRequest);

// router.put("/addReport", authMiddleware, addReport);

router.post(
	"/events/:eventId/addReport",
	// authMiddleware,
	upload.single("file"),
	addReport
);

router.post("/events/:eventId/attendance", authMiddleware, giveAttendance);
router.post("/events/:eventId/attendance/open", openAttendance);

router.post(
	"/events/:eventId/form-status",
	authMiddleware,
	checkUserFormStatus
);
export default router;
