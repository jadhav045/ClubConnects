import { Post } from "../../models/Postings/Post.Model.js";
import { Event } from "../../models/Postings/Event.Model.js";
import { Club } from "../../models/Roles/Club.Model.js";
import { User } from "../../models/User.Model.js";

export const createPost = async (req, res) => {
	try {
		const {
			content,
			category,
			tags,
			clubId,
			eventId,
			visibility,
			poll,
			mentions,
		} = req.body;

		let club = null;
		if (clubId) {
			club = await Club.findById(clubId);
			if (!club) {
				return res.status(404).json({ message: "Club not found" });
			}
		}

		if (eventId) {
			const event = await Event.findById(eventId);
			if (!event) {
				return res.status(404).json({ message: "Event not found" });
			}
		}

		// Create new post
		const newPost = new Post({
			author: {
				userId: req.user.id,
				role: req.user.role,
			},
			content,
			category,
			tags,
			clubId: clubId || null,
			eventId: eventId || null,
			visibility,
			poll,
			mentions,
		});

		const savedPost = await newPost.save();

		if (club) {
			await Club.findByIdAndUpdate(clubId, {
				$push: { posts: savedPost._id },
			});
		} else {
			await User.findByIdAndUpdate(req.user.id, {
				$push: { posts: savedPost._id },
			});
		}

		res.status(201).json(savedPost);
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

export const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.populate("author.userId", "username profilePicture")
			.populate("clubId", "name")
			.sort({ createdAt: -1 });

		console.log("Ppsts", posts);
		return res.json({
			message: "Post fetch successfully",
			success: true,
			posts,
		});
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

export const getPostById = async (req, res) => {
	try {
		let post;

		if (req.query.clubId) {
			const club = await Club.findById(req.query.clubId).populate({
				path: "posts",
				match: { _id: req.params.id },
				populate: [
					{ path: "author.userId", select: "username role" },
					{ path: "mentions", select: "username" },
				],
			});

			if (!club) {
				return res.status(404).json({ message: "Club not found" });
			}

			post = club.posts.length ? club.posts[0] : null;
		} else {
			post = await Post.findById(req.params.id)
				.populate("author.userId", "username role")
				.populate("mentions", "username");
		}

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.json(post);
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

export const updatePost = async (req, res) => {
	try {
		const { id } = req.params;
		const { clubId, content, category, tags, visibility, poll, mentions } =
			req.body;

		let post;

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
			post = await Post.findById(id);
			if (!post) {
				return res.status(404).json({ message: "Post not found" });
			}
		}

		if (post.author.userId.toString() !== req.user.id) {
			return res
				.status(403)
				.json({ message: "Not authorized to update this post" });
		}

		post.content = content || post.content;
		post.category = category || post.category;
		post.tags = tags || post.tags;
		post.visibility = visibility || post.visibility;
		post.poll = poll || post.poll;
		post.mentions = mentions || post.mentions;

		await post.save();

		return res.json(post);
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

		if (clubId) {
			const club = await Club.findById(clubId);

			if (!club) {
				return res.status(404).json({ message: "Club not found" });
			}

			post = club.posts.find((p) => p._id.toString() === id);

			if (!post) {
				return res.status(404).json({ message: "Post not found in this club" });
			}

			if (
				post.author.userId.toString() !== req.user.id &&
				req.user.role !== "Admin"
			) {
				return res.status(403).json({ message: "Not authorized" });
			}
			club.posts = club.posts.filter((p) => p._id.toString() !== id);
			await club.save();
		} else {
			post = await Post.findById(id);

			if (!post) {
				return res.status(404).json({ message: "Post not found" });
			}

			if (
				post.author.userId.toString() !== req.user.id &&
				req.user.role !== "Admin"
			) {
				return res.status(403).json({ message: "Not authorized" });
			}

			await post.deleteOne();

			await User.findByIdAndUpdate(post.author.userId, {
				$pull: { posts: post._id },
			});
		}

		return res.json({ message: "Post deleted successfully" });
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Server error", error: err.message });
	}
};
