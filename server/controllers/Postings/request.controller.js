import { Request } from "../../models/Postings/Request.Model.js";
import { Club } from "../../models/Roles/Club.Model.js";
import crypto from "crypto";

export const createRequestFn = async (req, res) => {
	try {
		// Parse FormData
		upload.array("attachments")(req, res, async (err) => {
			if (err) {
				return res
					.status(400)
					.json({ message: "File upload error", success: false });
			}

			const {
				clubId,
				requestType,
				title,
				description,
				justification,
				submittedBy,
			} = req.body;

			if (
				!clubId ||
				!requestType ||
				!title ||
				!description ||
				!justification ||
				!submittedBy
			) {
				return res.status(400).json({
					message: "All fields except attachments are required",
					success: false,
				});
			}

			const club = await Club.findById(clubId);
			if (!club) {
				return res
					.status(404)
					.json({ message: "Club not found", success: false });
			}

			// Handle file uploads to Cloudinary here (if required)

			const newRequest = new Request({
				clubId,
				requestType,
				title,
				description,
				justification,
				submittedBy,
				attachments,
			});

			const savedRequest = await newRequest.save();

			club.requests.push(savedRequest._id);
			await club.save();

			return res.status(201).json({
				message: "Request created successfully",
				request: savedRequest,
				success: true,
			});
		});
	} catch (error) {
		console.error("Error creating request:", error);
		return res.status(500).json({
			message: "Internal server error",
			error: error.message,
			success: false,
		});
	}
};

export const getAllRequest = async (req, res) => {
	try {
		console.log("We are in getAllRequest");
		const requests = await Request.find()
			.populate({ path: "clubId", select: "clubName profilePicture" })
			.populate({
				path: "submittedBy",
				select: "fullName email profilePicture",
			})
			.populate({
				path: "comments.commentBy", // Populate commentBy inside comments array
				select: "fullName", // Only fetch fullName
			});

		return res.status(200).json({
			requests,
			message: "Request Fetch Successfully",
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal server error",
			error: error.message,
			success: false,
		});
	}
};

export const updateRequestStatusAndComment = async (req, res) => {
	try {
		const { requestId } = req.params;
		const { requestStatus, commentBy, commentText } = req.body;

		// Validate input
		if (!requestId) {
			return res.status(400).json({ message: "Request ID is required" });
		}

		if (!requestStatus && (!commentBy || !commentText)) {
			return res.status(400).json({
				message:
					"Either requestStatus or both commentBy and commentText are required",
			});
		}

		// Fetch the current request
		const request = await Request.findById(requestId);
		if (!request) {
			return res.status(404).json({ message: "Request not found" });
		}

		const updateFields = {};

		// Handle status change to "Approved"
		if (requestStatus === "Approved") {
			// Generate unique ID only if the request isn't already approved
			if (request.requestStatus !== "Approved") {
				updateFields.uniqueRequestId = await generateUniqueRequestId();
			}
			updateFields.requestStatus = "Approved";
		} else if (requestStatus) {
			// For other statuses (e.g., Rejected, Pending)
			updateFields.requestStatus = requestStatus;
		}

		// Add comments if provided
		if (commentBy && commentText) {
			updateFields.$push = {
				comments: { commentBy, commentText, createdAt: new Date() },
			};
		}

		// Perform the update with conditions to prevent race issues
		const updatedRequest = await Request.findOneAndUpdate(
			{
				_id: requestId,
				// Ensure unique ID is only set if status wasn't already Approved
				...(requestStatus === "Approved" && {
					requestStatus: { $ne: "Approved" },
				}),
			},
			updateFields,
			{ new: true, runValidators: true }
		)
			.populate({ path: "clubId", select: "clubName profilePicture" })
			.populate({
				path: "submittedBy",
				select: "fullName email profilePicture",
			})
			.populate({
				path: "comments.commentBy",
				select: "fullName",
			});

		if (!updatedRequest) {
			return res
				.status(404)
				.json({ message: "Request not found or already approved" });
		}

		res.status(200).json({
			message: "Request updated successfully",
			updatedRequest,
			success: true,
		});
	} catch (error) {
		console.error("Error updating request:", error);
		res.status(500).json({
			message: "Internal server error",
			error: error.message,
			details: error.stack,
		});
	}
};

// Unique ID Generator (unchanged)
const generateUniqueRequestId = async () => {
	let isUnique = false;
	let uniqueId;

	while (!isUnique) {
		uniqueId = `REQ-${crypto.randomBytes(8).toString("hex")}`;
		const existingRequest = await Request.findOne({
			uniqueRequestId: uniqueId,
		});
		if (!existingRequest) isUnique = true;
	}

	return uniqueId;
};

export const updateRequest = async (req, res) => {
	try {
		const { requestId } = req.params;
		const { title, description, justification, attachments } = req.body;

		// Find and update the request details and reset status to "Pending"

		const updatedRequest = await Request.findByIdAndUpdate(
			requestId,
			{
				title,
				description,
				justification,
				attachments,
				requestStatus: "Pending",
			},
			{ new: true }
		)
			.populate({ path: "clubId", select: "clubName profilePicture" })
			.populate({
				path: "submittedBy",
				select: "fullName email profilePicture",
			});

		if (!updatedRequest) {
			return res.status(404).json({ message: "Request not found" });
		}

		res.status(200).json({
			message: "Request resubmitted successfully",
			request: updatedRequest,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
};

export const authenticateRequestClub = async (req, res) => {
	try {
		const { requestId, clubId } = req.params;

		// Validate input
		if (!requestId || !clubId) {
			return res.status(400).json({
				authenticated: false,
				message: "Both requestId and clubId are required",
			});
		}

		// Find the request and populate club details
		const request = await Request.findById(requestId).populate("clubId", "_id"); // Only get the club ID

		if (!request) {
			return res.status(404).json({
				authenticated: false,
				message: "Request not found",
			});
		}

		// Check if the request belongs to the specified club
		if (request.clubId._id.toString() !== clubId) {
			return res.status(403).json({
				authenticated: false,
				message: "This request does not belong to the specified club",
			});
		}

		// If all checks pass
		res.status(200).json({
			authenticated: true,
			message: "Request is valid for this club",
			request: {
				_id: request._id,
				title: request.title,
				status: request.requestStatus,
			},
		});
	} catch (error) {
		console.error("Authentication error:", error);

		// Handle invalid ObjectId format errors
		if (error.name === "CastError") {
			return res.status(400).json({
				authenticated: false,
				message: "Invalid ID format",
			});
		}

		res.status(500).json({
			authenticated: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};
