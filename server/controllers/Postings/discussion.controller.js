import { Discussion } from "../../models/Postings/Discussion.js";
import { User } from "../../models/User.Model.js";
import mongoose from "mongoose";
// Create a new discussion (Requires Authentication)
export const createDiscussionFn = async (req, res) => {
	try {
		const { title, description, category } = req.body;
		const createdBy = req.user.id; // Extracted from auth middleware
		const userRole = req.user.role; // Extracted from auth middleware
		const user = await User.findById(createdBy);
		if (!user) return res.status(404).json({ message: "User not found" });

		// Create discussion
		const newDiscussion = new Discussion({
			title,
			description,
			category,
			createdBy,
			userRole,
		});
		const savedDiscussion = await newDiscussion.save();

		// Add discussion to user's list
		user.discussions.push(savedDiscussion._id);
		await user.save();

		res.status(201).json({
			success: true,
			discussion: savedDiscussion,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};

export const getAllDiscussions = async (req, res) => {
	console.log("D");
	try {
		const discussions = await Discussion.find()
			.populate("createdBy", "profilePicture fullName _id")
			.populate({
				path: "comments.userId", // Populate userId inside comments
				select: "fullName profilePicture role",
			})
			.populate({
				path: "comments.replies.userId", // Populate userId inside replies
				select: "fullName profilePicture role",
			}); // Populate user details
		console.log(discussions);
		res.status(200).json({
			success: true,
			message: "Discussions fetched successfully",
			discussions,
		});
	} catch (error) {
		console.error("Error fetching discussions:", error);
		res
			.status(500)
			.json({ message: "Server error while fetching discussions" });
	}
};

export const updateDiscussion = async (req, res) => {
	try {
		console.log(req.body);
		const { id } = req.params;
		const { title, description } = req.body;
		const userId = req.user.id;

		// Validate request parameters
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid discussion ID" });
		}

		// Ensure title and description are provided
		if (!title || !description) {
			return res
				.status(400)
				.json({ message: "Title and description are required" });
		}

		const discussion = await Discussion.findById(id);
		if (!discussion) {
			return res.status(404).json({ message: "Discussion not found" });
		}

		// Check if user is authorized
		if (
			discussion.createdBy.toString() !== userId &&
			req.user.role !== "Admin"
		) {
			return res
				.status(403)
				.json({ message: "Not authorized to update this discussion" });
		}

		// Update discussion
		const updatedDiscussion = await Discussion.findByIdAndUpdate(
			id,
			{ title, description },
			{ new: true, runValidators: true } // Ensures schema validation on update
		);

		if (!updatedDiscussion) {
			return res.status(500).json({ message: "Failed to update discussion" });
		}

		return res.json({
			success: true,
			message: "Discussion updated successfully",
			discussion: updatedDiscussion,
		});
	} catch (error) {
		console.error("Error updating discussion:", error);
		return res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
};

// Delete Discussion
export const deleteDiscussion = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		const discussion = await Discussion.findById(id);
		if (!discussion) {
			return res.status(404).json({ message: "Discussion not found" });
		}

		// Check if user is authorized
		if (
			discussion.createdBy.toString() !== userId &&
			req.user.role !== "Admin"
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		await discussion.deleteOne();
		res.json({ success: true, message: "Discussion deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
export const toggleAppreciation = async (req, res) => {
	const { id } = req.params; // Discussion ID
	const userId = req.user.id; // Authenticated User ID

	// console.log(id, userId);
	try {
		const discussion = await Discussion.findById(id);
		if (!discussion) {
			return res.status(404).json({ message: "Discussion not found" });
		}
		// console.log(discussion)

		if (!Array.isArray(discussion.appreciations)) {
			discussion.appreciations = []; // Initialize if undefined
		}

		const index = discussion.appreciations
			.map((id) => id.toString()) // Convert all IDs to strings
			.indexOf(userId.toString()); // Ensure userId is a string

		// console.log(index);
		if (index === -1) {
			// If user hasn't appreciated, add them
			discussion.appreciations.push(userId);
		} else {
			// If user has already appreciated, remove them
			discussion.appreciations.splice(index, 1);
		}

		await discussion.save();
		res.status(200).json({
			success: true,
			appreciations: discussion.appreciations,
			count: discussion.appreciations.length, // Send total count
		});
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Server error", error: err.message });
	}
};

// Add Comment
export const addComment = async (req, res) => {
	try {
		const { id } = req.params;
		const { text } = req.body;
		const userId = req.user.id;

		console.log(req.body);
		const discussion = await Discussion.findById(id);
		if (!discussion) {
			return res.status(404).json({ message: "Discussion not found" });
		}

		const newComment = {
			userId,
			text,
			timestamp: new Date(),
			replies: [],
		};

		discussion.comments.push(newComment);
		await discussion.save();

		res.json({
			success: true,
			message: "Comment added successfully",
			comment: newComment,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Add Reply to Comment
export const addReply = async (req, res) => {
	try {
		const { discussionId, commentId } = req.params;
		const { text } = req.body;
		const userId = req.user.id;

		const discussion = await Discussion.findById(discussionId);
		if (!discussion) {
			return res.status(404).json({ message: "Discussion not found" });
		}

		const comment = discussion.comments.id(commentId);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		const newReply = {
			userId,
			text,
			timestamp: new Date(),
		};

		comment.replies.push(newReply);
		await discussion.save();

		res.json({
			success: true,
			message: "Reply added successfully",
			reply: newReply,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete Comment
export const deleteComment = async (req, res) => {
	try {
		const { discussionId, commentId } = req.params;
		const userId = req.user.id;

		const discussion = await Discussion.findById(discussionId);
		if (!discussion) {
			return res.status(404).json({ message: "Discussion not found" });
		}

		const comment = discussion.comments.id(commentId);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		// Check if user is authorized
		if (comment.userId.toString() !== userId && req.user.role !== "Admin") {
			return res.status(403).json({ message: "Not authorized" });
		}

		// Remove comment from the array
		discussion.comments = discussion.comments.filter(
			(c) => c._id.toString() !== commentId
		);
		await discussion.save();

		res.json({
			success: true,
			message: "Comment deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete Reply
export const deleteReply = async (req, res) => {
	try {
		const { discussionId, commentId, replyId } = req.params;
		const userId = req.user.id;

		const discussion = await Discussion.findById(discussionId);
		if (!discussion) {
			return res.status(404).json({ message: "Discussion not found" });
		}

		const comment = discussion.comments.id(commentId);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		const reply = comment.replies.id(replyId);
		if (!reply) {
			return res.status(404).json({ message: "Reply not found" });
		}

		// Check if user is authorized
		if (reply.userId.toString() !== userId && req.user.role !== "Admin") {
			return res.status(403).json({ message: "Not authorized" });
		}

		// Remove reply from the array
		comment.replies = comment.replies.filter(
			(r) => r._id.toString() !== replyId
		);
		await discussion.save();

		res.json({
			success: true,
			message: "Reply deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
