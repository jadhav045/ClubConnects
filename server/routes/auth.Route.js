import express from "express";
import {
	register,
	login,
	logout,
	getUserProfile,
	updateUserProfile,
	getUserNotifications,
	markAllAsRead,
	markAsRead,
	getAlumni,
} from "../controllers/auth.Controller.js";

import { authMiddleware } from "../middlewares/auth.Middleware.js";
import upload from "../middlewares/multer.js";
import { uploadMultipleFiles } from "../utils/uploadController.js";
import {
	getClubAnalytics,
	getClubs,
} from "../controllers/Roles/clubAnalytics.js";
// import { uploadMultipleFiles } from "../utils/fileUpload.js";

const router = express.Router();

// Registration route
router.post("/register", register);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

router.get("/:userId", authMiddleware, getUserProfile);

router.put(
	"/updateProfile",
	upload.single("file"),
	authMiddleware,
	updateUserProfile
);
router.get("/notifications", authMiddleware, getUserNotifications);
router.put("/read-all", authMiddleware, markAllAsRead);
router.put("/:notificationId/read", authMiddleware, markAsRead);
router.post("/upload", upload.array("resources", 10), uploadMultipleFiles);

// Analytics
router.post("/clubs", getClubs);
router.get("/faculty/club-analytics/:clubId", getClubAnalytics);
// get alumi
router.get("/alumni", getAlumni);
export default router;
