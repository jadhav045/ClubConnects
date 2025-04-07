import { Post } from "../../models/Postings/Post.Model.js";
import { Event } from "../../models/Postings/Event.Model.js";
import { Club } from "../../models/Roles/Club.Model.js";
import { User } from "../../models/User.Model.js";
import { Poll } from "../../models/Postings/Poll.Model.js";
import uploadImage from "../../utils/fileUpload.js";
export const createPost = async (req, res) => {
	try {
		const {
			text,
			category,
			tags,
			clubId,
			eventId,
			isPublic,
			mentions
		} = req.body;

		let clubExists = null;
		if (clubId) {
			try {
				clubExists = await Club.findById(clubId);
				if (!clubExists) {
					return res.status(404).json({ message: "Club not found." });
				}
			} catch (error) {
				console.error("Error checking club existence:", error);
				return res.status(500).json({
					message: "Error checking club existence.",
					error: error.message,
				});
			}
		}

		// **3. Check if the Event exists (if provided)**
		let eventExists = null;
		if (eventId) {
			try {
				eventExists = await Event.findById(eventId);
				if (!eventExists) {
					return res.status(404).json({ message: "Event not found." });
				}
			} catch (error) {
				console.error("Error checking event existence:", error);
				return res.status(500).json({
					message: "Error checking event existence.",
					error: error.message,
				});
			}
		}

		const attachments = {
			fileUrl:"",
			fileType: "jpg",
		};
		// **4. Create a New Post**
		if (req.file) {
			const url = await uploadImage(req.file);
			console.log("profile", url?.fileUrl);
			attachments.fileUrl = url?.fileUrl;
		}

		let newPost;
		try {
			newPost = new Post({
				authorId: req.user.id,
				authorRole: req.user.role,
				text,
				category,
				clubId: clubId || null,
				eventId: eventId || null,
				isPublic: isPublic ?? true, // Default to true if not provided
				mentions,
				attachments: attachments || [],
			});
			await newPost.save();
			console.log("New ost ", newPost.attachments);
		} catch (error) {
			console.error("Error creating post object:", error);
			return res
				.status(500)
				.json({ message: "Error creating post object.", error: error.message });
		}

		// **5. Save Post to Database**
		let savedPost;
		try {
			savedPost = await newPost.save();
		} catch (error) {
			console.error("Error saving post to database:", error);
			return res
				.status(500)
				.json({ message: "Error saving post.", error: error.message });
		}

		// **6. Update the Relevant Entity (Club/User)**
		try {
			const updateTarget = clubId ? Club : User;
			const updateId = clubId || req.user.id;
			await updateTarget.findByIdAndUpdate(updateId, {
				$push: { posts: savedPost._id },
			});
		} catch (error) {
			console.error("Error updating post references:", error);
			return res.status(500).json({
				message: "Error updating post references.",
				error: error.message,
			});
		}

		// **7. Return Success Response**
		return res.status(201).json({
			savedPost,
			message: "Post successfully added.",
			success: true,
		});
	} catch (err) {
		console.error("Unexpected server error:", err);
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: err.message });
	}
};

export const replyPoll = async (req, res) => {
	try {
		const { pollId, optionId } = req.body;
		const userId = req.user.id;

		// Find the poll
		const poll = await Poll.findById(pollId);
		if (!poll) {
			return res.status(404).json({
				message: "Poll not found",
			});
		}

		// Check if poll is still active
		if (!poll.isActive) {
			return res.status(400).json({
				message: "This poll has ended",
			});
		}

		// Check if user has already voted
		const hasVoted = poll.votes.some(
			(vote) => vote.userId.toString() === userId
		);

		if (hasVoted && !poll.allowMultipleVotes) {
			return res.status(400).json({
				message: "You have already voted in this poll",
			});
		}

		// Find the option
		const option = poll.pollOptions.id(optionId);
		if (!option) {
			return res.status(400).json({
				message: "Invalid poll option",
			});
		}

		try {
			// Use the vote method from the Poll model
			await poll.vote(userId, optionId);

			return res.status(200).json({
				message: "Vote recorded successfully",
				poll: await Poll.findById(pollId),
			});
		} catch (error) {
			return res.status(400).json({
				message: error.message,
			});
		}
	} catch (err) {
		console.error("Error recording vote:", err);
		res.status(500).json({
			message: "Server error",
			error: err.message,
		});
	}
};

export const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.populate("authorId", "fullName profilePicture") // Populate author
			.populate("clubId", "name") // Populate club
			.populate({
				path: "comments.userId", // Populate userId inside comments
				select: "fullName profilePicture role",
			})
			.populate({
				path: "comments.replies.userId", // Populate userId inside replies
				select: "fullName profilePicture role",
			})
			.sort({ createdAt: -1 });

		// console.log(posts);
		return res.json({
			message: "Posts fetched successfully",
			success: true,
			posts,
			totalPosts: posts.length,
		});
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

export const updatePost = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			clubId,
			text,
			category,
			tags,
			isPublic,
			allowedRoles,
			pollQuestion,
			pollOptions,
			mentions,
			attachments,
		} = req.body;

		let post;

		// If the post is linked to a club, fetch it from there
		if (clubId) {
			const club = await Club.findById(clubId).populate("posts");

			if (!club) {
				return res.status(404).json({ message: "Club not found" });
			}

			post = club.posts.find((p) => p._id.toString() === id);

			if (!post) {
				return res.status(404).json({ message: "Post not found in this club" });
			}
		} else {
			// Otherwise, fetch it normally
			post = await Post.findById(id);
			if (!post) {
				return res.status(404).json({ message: "Post not found" });
			}
		}

		// Check if the user is the author
		if (post.authorId.toString() !== req.user.id) {
			return res
				.status(403)
				.json({ message: "Not authorized to update this post" });
		}

		// Update fields
		post.text = text || post.text;
		post.category = category || post.category;
		post.tags = tags || post.tags;
		post.isPublic = isPublic !== undefined ? isPublic : post.isPublic;
		post.allowedRoles = allowedRoles || post.allowedRoles;
		post.mentions = mentions || post.mentions;

		// Update attachments if provided
		if (attachments) {
			post.attachments = attachments.map((file) => ({
				fileUrl: file.fileUrl,
				fileType: file.fileType,
			}));
		}

		// Update poll if provided
		if (pollQuestion) {
			post.pollQuestion = pollQuestion;
			post.pollOptions =
				pollOptions?.map((option) => ({
					optionText: option.optionText,
					votes: option.votes || 0,
				})) || [];
		}

		await post.save();

		return res.json({ message: "updated successfully", success: true, post });
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Server error", error: err.message });
	}
};

export const deletePost = async (req, res) => {
	try {
		const { id } = req.params;
		const { clubId } = req.body;

		let post;

		// If the post belongs to a club
		if (clubId) {
			const club = await Club.findById(clubId);

			if (!club) {
				return res.status(404).json({ message: "Club not found" });
			}

			post = club.posts.find((p) => p._id.toString() === id);

			if (!post) {
				return res.status(404).json({ message: "Post not found in this club" });
			}

			// Check if the user is the author or an Admin
			if (
				post.authorId.toString() !== req.user.id &&
				req.user.role !== "Admin"
			) {
				return res.status(403).json({ message: "Not authorized" });
			}

			// Remove the post from the club's posts array
			club.posts = club.posts.filter((p) => p._id.toString() !== id);
			await club.save();
		} else {
			// If it's a general post
			post = await Post.findById(id);

			if (!post) {
				return res.status(404).json({ message: "Post not found" });
			}

			// Authorization check
			if (
				post.authorId.toString() !== req.user.id &&
				req.user.role !== "Admin"
			) {
				return res.status(403).json({ message: "Not authorized" });
			}

			// Remove the post from the user's posts array
			await User.findByIdAndUpdate(post.authorId, {
				$pull: { posts: post._id },
			});

			// Delete the post itself
			await post.deleteOne();
		}

		return res.json({ message: "Post deleted successfully" });
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Server error", error: err.message });
	}
};

export const savePostFn = async (req, res) => {
	try {
		const { postId, clubId } = req.params; // Post ID & optional Club ID
		const userId = req.user.id;

		let post;
		let entity; // Can be a Club or User

		// Check if the post belongs to a club
		if (clubId) {
			entity = await Club.findById(clubId);
			if (!entity) return res.status(404).json({ message: "Club not found" });

			post = entity.posts.find((p) => p._id.toString() === postId);
			if (!post)
				return res.status(404).json({ message: "Post not found in this club" });
		} else {
			// Otherwise, it's a general post
			entity = await User.findById(userId);
			post = await Post.findById(postId);
			if (!post) return res.status(404).json({ message: "Post not found" });
		}

		// Check if the post is already saved
		const isSaved = entity.saved.includes(postId);

		if (isSaved) {
			// If saved, remove it
			entity.saved = entity.saved.filter((id) => id.toString() !== postId);
			await entity.save();
			return res.json({ message: "Post unsaved successfully" });
		} else {
			// Otherwise, save it
			entity.saved.push(postId);
			await entity.save();
			return res.json({ message: "Post saved successfully" });
		}
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Server error", error: err.message });
	}
};

export const getPost = async (req, res) => {
	try {
		const { postId } = req.params;
		// console.log("postId", postId);
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		console.log(post);
		return res.json(post);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
