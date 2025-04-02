import express from "express";
import {
	deletePost,
	updatePost,
	createPost,
	getAllPosts,
	savePostFn,
	createPoll,
	replyPoll,
	getPost,
	// getPostById,
} from "../../controllers/Postings/post.controller.js";
import { authMiddleware } from "../../middlewares/auth.Middleware.js";
import {
	toggleLikePost,
	addComment,
	deleteComment,
	addReply,
	deleteReplyComment,
} from "../../controllers/Postings/post.Functions.controller.js";
const router = express();
// Create
router.post("/", authMiddleware, createPost);
router.post("/poll", authMiddleware, createPoll);
router.put("/replypoll", authMiddleware, replyPoll);
// router.get("/:id", authMiddleware, getPostById);
// Read
router.get("/", getAllPosts);
// router.get("/:id", authMiddleware, getPostById);

// Update
router.put("/:id", authMiddleware, updatePost);

// Delete
router.delete("/:id", authMiddleware, deletePost);

router.put("/:id/like", authMiddleware, toggleLikePost);

router.post("/:id/comment", authMiddleware, addComment);

router.delete("/:postId/comment/:commentId", authMiddleware, deleteComment);

router.post("/:postId/comment/:commentId/reply", authMiddleware, addReply);

router.delete(
	"/:postId/comment/:commentId/replies/:replyId",
	authMiddleware,

	deleteReplyComment
);

router.put("/save/:postId/:clubId?", authMiddleware, savePostFn);

router.get("/:postId", getPost);
export default router;
