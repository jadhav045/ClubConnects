import express from "express";
import { register, login, logout } from "../controllers/auth.Controller.js";

import { authMiddleware } from "../middlewares/auth.Middleware.js";

const router = express.Router();

// Registration route
router.post("/register", register);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);
router.get("/protected", authMiddleware, (req, res) => {
	res
		.status(200)
		.json({
			message: "You have access to this protected route",
			user: req.user,
		});
});
export default router;
