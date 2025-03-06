import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true }, // Announcement title
		message: { type: String, required: true, trim: true }, // Main announcement content

		announcementType: {
			type: String,
			enum: ["GENERAL", "URGENT"], // Priority levels
			default: "GENERAL",
		},

		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Who created the announcement
			required: true,
		},

		userRole: {
			type: String,
			enum: ["FACULTY", "CLUB_ADMIN", "PLATFORM_ADMIN"], // Who posted it
			required: true,
		},

		targetAudience: {
			type: String,
			enum: ["FACULTY", "CLUB_PRESIDENT", "STUDENTS", "ALUMNI", "ALL"], // Target audience selection
			required: true,
		},

		attachments: [
			{
				fileType: {
					type: String,
					enum: ["IMAGE", "DOCUMENT", "VIDEO", "URL"], // File types
				},
				fileUrl: { type: String, required: true }, // File path or link
			},
		],

		readBy: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				readAt: { type: Date, default: Date.now },
			},
		],

		isActive: { type: Boolean, default: true }, // If false, it's expired/hidden
		expiresAt: { type: Date }, // Optional expiration date

		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
