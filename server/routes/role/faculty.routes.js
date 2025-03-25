import express from "express";

import {
	assignRoleFn,
	createClubFn,
	getAllClubs,
} from "../../controllers/Roles/faculty.controller.js";
import {
	updateCollegeProfile,
	updateFacultyProfileFn,
} from "../../controllers/profile.Controller.js";
import { authMiddleware } from "../../middlewares/auth.Middleware.js";
import { roleMiddleware } from "../../middlewares/role.Middleware.js";
import {
	createRequestFn,
	getAllRequest,
	updateRequest,
	updateRequestStatusAndComment,
	authenticateRequestClub,
} from "../../controllers/Postings/request.controller.js";

const router = express();

router.post("/create/club/:facultyId", createClubFn);
router.post("/assignRoles/:facultyId", assignRoleFn);
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

// requests

router.post("/request/add", createRequestFn);
router.get("/request/list", getAllRequest);
router.put("/request/updatestatus/:requestId", updateRequestStatusAndComment);
router.put("/request/update/:requestId", updateRequest);
router.get(
	"/request/:clubId/requests/:requestId/authenticate",
	authenticateRequestClub
);

router.get("/clubs/list", getAllClubs);

export default router;
