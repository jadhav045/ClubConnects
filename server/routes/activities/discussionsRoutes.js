import express from "express";
import {
	createDiscussionFn,
	getAllDiscussions,
	updateDiscussion,
	deleteDiscussion,
	toggleAppreciation,
	addComment,
	addReply,
	deleteComment,
	deleteReply,
} from "../../controllers/Postings/discussion.controller.js";
import { authMiddleware } from "../../middlewares/auth.Middleware.js";
const router = express();

router.post("/", authMiddleware, createDiscussionFn);
router.get("/", getAllDiscussions);
// Discussion routes
router.put("/:id", authMiddleware, updateDiscussion);
router.delete("/:id", authMiddleware, deleteDiscussion);
router.put("/:id/appreciate", authMiddleware, toggleAppreciation);

// Comment routes
router.post("/:id/comment", authMiddleware, addComment);
router.delete(
	"/:discussionId/comment/:commentId",
	authMiddleware,
	deleteComment
);

// Reply routes
router.post(
	"/:discussionId/comment/:commentId/reply",
	authMiddleware,
	addReply
);
router.delete(
	"/:discussionId/comment/:commentId/reply/:replyId",
	authMiddleware,
	deleteReply
);
export default router;
