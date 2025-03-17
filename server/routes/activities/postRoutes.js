import express from "express";
import {
	deletePost,
	updatePost,
	createPost,
	getAllPosts,
	getPostById,
} from "../../controllers/Postings/post.controller.js";
import { authMiddleware } from "../../middlewares/auth.Middleware.js";
import {
	toggleLikePost,
	addComment,
	deleteComment,
	reactToPost,
	removeReaction,
	addReply,
} from "../../controllers/Postings/post.Functions.controller.js";
const router = express();
// Create
router.post("/", authMiddleware, createPost);
router.get("/:id", authMiddleware, getPostById);
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
router.post("/:id/react", authMiddleware, reactToPost);
router.put("/:id/remove-reaction", authMiddleware, removeReaction);

router.post("/:postId/comments/:commentId/reply", authMiddleware, addReply);
export default router;
