import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		authorRole: {
			type: String,
			enum: ["Student", "Faculty", "Club Admin", "Alumni", "Admin"],
			required: true,
		},

		text: { type: String },
		attachments: [
			{
				fileUrl: { type: String, required: true, trim: true },
				fileType: { type: String, enum: ["jpg", "png", "mp4"], required: true },
			},
		],

		category: {
			type: String,
			enum: ["Announcement", "Event", "Discussion", "Study Material", "Others"],
			required: true,
		},

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

		isPublic: { type: Boolean, default: true },
		allowedRoles: [
			{
				type: String,
				enum: ["Student", "Faculty", "Club Admin", "Alumni", "Admin"],
			},
		],

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
				replies: [
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
			},
		],

		mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		pinned: { type: Boolean, default: false },

		isScheduled: { type: Boolean, default: false },
		publishAt: { type: Date, default: null },

		trendingScore: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
