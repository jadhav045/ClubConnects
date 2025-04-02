import express from "express";
import {
	register,
	login,
	logout,
	getUserProfile,
	updateUserProfile,
} from "../controllers/auth.Controller.js";

import { authMiddleware } from "../middlewares/auth.Middleware.js";

const router = express.Router();

// Registration route
router.post("/register", register);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

router.get("/protected", authMiddleware, (req, res) => {
	res.status(200).json({
		message: "You have access to this protected route",
		user: req.user,
	});
});

router.get("/:userId", authMiddleware, getUserProfile);
router.put("/updateProfile", authMiddleware, updateUserProfile);
export default router;
