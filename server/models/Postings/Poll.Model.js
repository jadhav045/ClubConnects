import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
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
		clubId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Club",
			default: null,
		},
		pollQuestion: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			default: "",
		},
		pollOptions: [
			{
				optionText: {
					type: String,
					required: true,
				},
				votes: {
					type: Number,
					default: 0,
				},
			},
		],
		votes: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				optionId: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
				},
			},
		],
		totalVotes: {
			type: Number,
			default: 0,
		},
		endDate: {
			type: Date,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		allowMultipleVotes: {
			type: Boolean,
			default: false,
		},
		isPublic: {
			type: Boolean,
			default: true,
		},
		allowedRoles: [
			{
				type: String,
				enum: ["Student", "Faculty", "Club Admin", "Alumni", "Admin"],
			},
		],
	},
	{
		timestamps: true,
	}
);

// Add middleware to check if poll has ended
pollSchema.pre("save", function (next) {
	if (this.endDate < new Date()) {
		this.isActive = false;
	}
	next();
});

// Add methods to handle voting
pollSchema.methods.vote = async function (userId, optionId) {
	if (!this.isActive) {
		throw new Error("Poll has ended");
	}

	const existingVote = this.votes.find(
		(v) => v.userId.toString() === userId.toString()
	);
	if (existingVote && !this.allowMultipleVotes) {
		throw new Error("User has already voted");
	}

	const option = this.pollOptions.id(optionId);
	if (!option) {
		throw new Error("Invalid option");
	}

	option.votes += 1;
	this.votes.push({ userId, optionId });
	this.totalVotes += 1;
	await this.save();

	return this;
};

export const Poll = mongoose.model("Poll", pollSchema);
