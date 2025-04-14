import express from "express";
import {
	deletePost,
	updatePost,
	createPost,
	getAllPosts,
	savePostFn,
	getPost,
} from "../../controllers/Postings/post.controller.js";
import { authMiddleware } from "../../middlewares/auth.Middleware.js";
import {
	toggleLikePost,
	addComment,
	deleteComment,
	addReply,
	deleteReplyComment,
} from "../../controllers/Postings/post.Functions.controller.js";
import upload from "../../middlewares/multer.js";
const router = express();
// Create
router.post("/", upload.single("attachments"), authMiddleware, createPost);

router.get("/", getAllPosts);

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
