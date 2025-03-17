import { Post } from "../../models/Postings/Post.Model.js";
import { Event } from "../../models/Postings/Event.Model.js";
import { Club } from "../../models/Roles/Club.Model.js";
import { User } from "../../models/User.Model.js";

export const toggleLikePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ message: "Post not found" });

		const userId = req.user.id;
		const isLiked = post.interactions.likes.includes(userId);

		// Toggle like
		if (isLiked) {
			post.interactions.likes.pull(userId);
		} else {
			post.interactions.likes.push(userId);
		}

		await post.save();
		res.json({ message: isLiked ? "Like removed" : "Post liked" });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

export const addComment = async (req, res) => {
	try {
		const { text } = req.body;
		if (!text)
			return res.status(400).json({ message: "Comment cannot be empty" });

		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ message: "Post not found" });

		const newComment = {
			userId: req.user.id,
			text,
			timestamp: new Date(),
		};

		post.interactions.comments.push(newComment);
		await post.save();

		res.status(201).json({ message: "Comment added", comment: newComment });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};
export const reactToPost = async (req, res) => {
	try {
		const { reactionType } = req.body;
		const userId = req.user.id; // Assuming user ID is available from auth middleware
		const validReactions = ["like", "love", "fire"];

		if (!validReactions.includes(reactionType)) {
			return res.status(400).json({ message: "Invalid reaction type" });
		}

		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ message: "Post not found" });

		// Find if the user has already reacted
		let previousReaction = null;
		for (const reaction of validReactions) {
			if (post.interactions.reactions[reaction][userId]) {
				previousReaction = reaction;
				break;
			}
		}

		// Remove previous reaction if exists
		if (previousReaction) {
			delete post.interactions.reactions[previousReaction][userId];
		}

		// Add new reaction
		post.interactions.reactions[reactionType][userId] = true;

		await post.save();

		res.json({
			message: `Reaction updated to ${reactionType}`,
			reactions: post.interactions.reactions,
		});
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

export const removeReaction = async (req, res) => {
	try {
		const { reactionType } = req.body;
		const validReactions = ["like", "love", "fire"];

		if (!validReactions.includes(reactionType)) {
			return res.status(400).json({ message: "Invalid reaction type" });
		}

		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ message: "Post not found" });

		if (post.interactions.reactions[reactionType] > 0) {
			post.interactions.reactions[reactionType] -= 1;
		}

		await post.save();
		res.json({
			message: `${reactionType} reaction removed`,
			reactions: post.interactions.reactions,
		});
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

export const deleteComment = async (req, res) => {
	try {
		const { postId, commentId } = req.params;
		const post = await Post.findById(postId);

		if (!post) return res.status(404).json({ message: "Post not found" });

		// Find comment
		const commentIndex = post.interactions.comments.findIndex(
			(comment) => comment._id.toString() === commentId
		);

		if (commentIndex === -1)
			return res.status(404).json({ message: "Comment not found" });

		// Check ownership
		if (
			post.interactions.comments[commentIndex].userId.toString() !==
				req.user.id &&
			req.user.role !== "Admin"
		) {
			return res
				.status(403)
				.json({ message: "Not authorized to delete this comment" });
		}

		// Remove comment
		post.interactions.comments.splice(commentIndex, 1);
		await post.save();

		res.json({ message: "Comment deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

// export const addComment = async (req, res) => {
// 	try {
// 		const { postId } = req.params;
// 		const { userId, text } = req.body;

// 		const post = await Post.findById(postId);
// 		if (!post) return res.status(404).json({ message: "Post not found" });

// 		const newComment = { userId, text, timestamp: new Date(), replies: [] };

// 		post.interactions.comments.push(newComment);
// 		await post.save();

// 		res.status(201).json({ message: "Comment added successfully", post });
// 	} catch (error) {
// 		res.status(500).json({ error: error.message });
// 	}
// };
export const addReply = async (req, res) => {
	try {
		const { text } = req.body;
		if (!text)
			return res.status(400).json({ message: "Reply cannot be empty" });

		const { postId, commentId } = req.params;
		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ message: "Post not found" });

		const comment = post.interactions.comments.id(commentId);
		if (!comment) return res.status(404).json({ message: "Comment not found" });

		const newReply = {
			userId: req.user.id,
			text,
			timestamp: new Date(),
		};

		comment.replies.push(newReply);
		await post.save();

		res.status(201).json({ message: "Reply added", reply: newReply });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};
