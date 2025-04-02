import express from "express";
import { authMiddleware } from "../../middlewares/auth.Middleware.js";
import {
	acceptConnection,
	cancelConnection,
	followUser,
	sendConnection,
	unfollowUser,
} from "../../controllers/Postings/connectivity.controller.js";

const router = express();

router.post("/follow/:userId", authMiddleware, followUser);
router.post("/unfollow/:userId", authMiddleware, unfollowUser);
router.post("/connect/:userId", authMiddleware, sendConnection);
router.post("/accept-connection/:requestId", authMiddleware, acceptConnection);
router.post("/cancel-connection/:requestId", authMiddleware, cancelConnection);

export default router;
