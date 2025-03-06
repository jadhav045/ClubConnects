const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		author: {
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
			role: {
				type: String,
				enum: ["Student", "Faculty", "Club Admin", "Alumni", "Admin"],
				required: true,
			},
		},
		content: {
			text: { type: String, required: true },
			attachments: [
				{
					fileUrl: { type: String, required: true },
					fileType: {
						type: String,
						enum: ["pdf", "docx", "jpg", "png", "mp4", "other"],
						required: true,
					},
				},
			],
		},
		category: {
			type: String,
			enum: ["Announcement", "Event", "Discussion", "Study Material"],
			required: true,
		},
		tags: [{ type: String }],
		clubId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Club",
			default: null,
		},
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			default: null,
		},
		visibility: {
			isPublic: { type: Boolean, default: true },
			allowedRoles: [
				{
					type: String,
					enum: ["Student", "Faculty", "Club Admin", "Alumni", "Admin"],
				},
			],
		},
		interactions: {
			likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
			comments: [
				{
					userId: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "User",
						required: true,
					},
					text: { type: String, required: true },
					timestamp: { type: Date, default: Date.now },
				},
			],
			reactions: {
				like: { type: Number, default: 0 },
				love: { type: Number, default: 0 },
				fire: { type: Number, default: 0 },
			},
		},
		poll: {
			question: { type: String, default: null },
			options: [
				{
					optionText: { type: String, required: true },
					votes: { type: Number, default: 0 },
				},
			],
			totalVotes: { type: Number, default: 0 },
		},
		mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		pinned: { type: Boolean, default: false },
		scheduled: {
			isScheduled: { type: Boolean, default: false },
			publishAt: { type: Date, default: null },
		},
		trendingScore: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
