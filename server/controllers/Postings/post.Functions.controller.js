import { io } from "../../index.js";
import { Post } from "../../models/Postings/Post.Model.js";
import mongoose from "mongoose";
import { addNotification } from "../notification.controller.js";

export const toggleLikePost = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		// Ensure userId is an ObjectId
		const objectIdUserId = new mongoose.Types.ObjectId(userId);

		// Find the post by ID
		const post = await Post.findById(id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Check if user has already liked the post
		const isLiked = post.likes.includes(objectIdUserId);

		if (isLiked) {
			// Remove like
			post.likes.pull(objectIdUserId);
		} else {
			// Add like
			post.likes.push(objectIdUserId);

			const data = {
				type: "TRIP_UPDATE",
				from: userId,
				to: [post.authorId],
				entityType: "Post",
				entityId: post._id,
				message: `Your post has been liked`,
			};
			await addNotification(data, userId);
			// io.emit("notification",`${userId} has liked your post ${post._id}`);
		}

		await post.save();

		return res.json({
			message: isLiked ? "Like removed" : "Post liked",
			success: true,
			totalLikes: post.likes.length,
			isLiked: !isLiked,
		});
	} catch (err) {
		console.error("Error in toggleLikePost:", err);
		return res.status(500).json({
			message: "Server error",
			error: err.message,
		});
	}
};

export const addComment = async (req, res) => {
	try {
		const { text } = req.body;
		const userId = req.user.id;
		if (!text) {
			return res.status(400).json({ message: "Comment cannot be empty" });
		}

		// Convert userId to ObjectId
		const objectIdUserId = new mongoose.Types.ObjectId(req.user.id);

		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Create new comment with proper ObjectId
		const newComment = {
			userId: objectIdUserId, // Ensure ObjectId format
			text,
			timestamp: new Date(),
		};

		// Push comment to the array
		post.comments.push(newComment); // Updated to match schema

		await post.save();

		const data = {
			type: "TRIP_UPDATE",
			from: userId,
			to: [post.authorId],
			// tripId: "trip456",
			message: `Your post having ${post._id} has been commented by ${userId} as comment ${text}`,
		};
		await addNotification(data);

		return res.status(201).json({
			message: "Comment added successfully",
			success: true,
			comment: newComment,
			totalComments: post.comments.length, // Optional: return total comments count
		});
	} catch (err) {
		return res.status(500).json({
			message: "Server error",
			error: err.message,
		});
	}
};

// Function to delete a comment (including its replies)
export const deleteComment = async (req, res) => {
	try {
		const { postId, commentId } = req.params;
		const post = await Post.findById(postId);

		if (!post) return res.status(404).json({ message: "Post not found" });

		// Find the comment
		const commentIndex = post.comments.findIndex(
			(comment) => comment._id.toString() === commentId
		);

		if (commentIndex === -1)
			return res.status(404).json({ message: "Comment not found" });

		// Check ownership
		if (
			post.comments[commentIndex].userId.toString() !== req.user.id &&
			req.user.role !== "Admin"
		) {
			return res
				.status(403)
				.json({ message: "Not authorized to delete this comment" });
		}

		// Remove comment (along with its replies)
		post.comments.splice(commentIndex, 1);
		await post.save();

		res.json({ message: "Comment deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

// Function to delete a reply inside a comment
export const deleteReplyComment = async (req, res) => {
	try {
		const { postId, commentId, replyId } = req.params;
		const post = await Post.findById(postId);

		if (!post) return res.status(404).json({ message: "Post not found" });

		// Find the comment
		const comment = post.comments.id(commentId);
		if (!comment) return res.status(404).json({ message: "Comment not found" });

		// Find the reply
		const replyIndex = comment.replies.findIndex(
			(reply) => reply._id.toString() === replyId
		);

		if (replyIndex === -1)
			return res.status(404).json({ message: "Reply not found" });

		// Check reply ownership
		if (
			comment.replies[replyIndex].userId.toString() !== req.user.id &&
			req.user.role !== "Admin"
		) {
			return res
				.status(403)
				.json({ message: "Not authorized to delete this reply" });
		}

		// Remove the reply
		comment.replies.splice(replyIndex, 1);
		await post.save();

		res.json({ message: "Reply deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

export const addReply = async (req, res) => {
	try {
		const { text } = req.body;
		if (!text) {
			return res.status(400).json({ message: "Reply cannot be empty" });
		}

		const { postId, commentId } = req.params;

		// Ensure `postId` and `commentId` are valid ObjectIds
		if (
			!mongoose.Types.ObjectId.isValid(postId) ||
			!mongoose.Types.ObjectId.isValid(commentId)
		) {
			return res.status(400).json({ message: "Invalid post or comment ID" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Find comment in the post's comments array
		const comment = post.comments.id(commentId); // Updated based on schema
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		// Ensure `userId` is an ObjectId
		const objectIdUserId = new mongoose.Types.ObjectId(req.user.id);

		// Create new reply object
		const newReply = {
			userId: objectIdUserId, // Ensure ObjectId format
			text,
			timestamp: new Date(),
		};

		// Push the reply into comment's replies array
		comment.replies.push(newReply);
		await post.save();

		return res.status(201).json({
			message: "Reply added successfully",
			success: true,
			reply: newReply,
			totalReplies: comment.replies.length, // Optional: return total replies count
		});
	} catch (err) {
		return res.status(500).json({
			message: "Server error",
			error: err.message,
		});
	}
};
