import React, { useState } from "react";
import DialogComponent from "../common/DialogComponent";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setRequests } from "../../store/slice/requestSlice";
import {
	Paper,
	Typography,
	Button,
	TextField,
	Divider,
	Box,
	Chip,
} from "@mui/material";

const RequestDetails = ({ open, onClose, request }) => {
	const { user } = useSelector((store) => store.auth);
	const { requests } = useSelector((store) => store.request);
	const dispatch = useDispatch();
	const [commentText, setCommentText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleAddComment = async () => {
		if (!commentText.trim()) return;
		setIsSubmitting(true);
		try {
			const response = await axios.put(
				`http://localhost:3002/faculty/request/updatestatus/${request._id}`,
				{
					commentBy: user._id,
					commentText,
				}
			);

			updateRequestInStore(response.data.updatedRequest);
			alert("Comment added successfully!");
			setCommentText("");
		} catch (error) {
			console.error("Error adding comment:", error);
			alert("Failed to add comment");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleStatusChange = async (newStatus) => {
		if (
			!window.confirm(
				`Are you sure you want to change the status to "${newStatus}"?`
			)
		) {
			return;
		}
		setIsSubmitting(true);
		try {
			const response = await axios.put(
				`http://localhost:3002/faculty/request/updatestatus/${request._id}`,
				{ requestStatus: newStatus }
			);
			alert("Status updated successfully!");
		} catch (error) {
			console.error("Error updating request status:", error);
			alert("Failed to update status");
		} finally {
			setIsSubmitting(false);
		}
	};

	const updateRequestInStore = (updatedRequest) => {
		if (!updatedRequest || !updatedRequest._id) {
			console.error("Invalid updated request object:", updatedRequest);
			return;
		}
		const newRequests = requests
			.filter((req) => req._id !== updatedRequest._id)
			.concat(updatedRequest);
		dispatch(setRequests(newRequests));
	};

	return (
		<DialogComponent
			open={open}
			onClose={onClose}
		>
			<Paper
				elevation={3}
				className="p-6 w-full max-w-2xl mx-auto"
			>
				<Typography
					variant="h5"
					fontWeight="bold"
					className="mb-4"
				>
					🔍 Full Request Details
				</Typography>

				{/* Request Information */}
				<Box className="mb-4">
					<Typography>
						<strong>📌 Request ID:</strong> {request.id || "N/A"}
					</Typography>
					<Typography>
						<strong>🏛 Club:</strong> {request.clubId?.clubName || "N/A"}
					</Typography>
					<Typography>
						<strong>👤 Submitted By:</strong>{" "}
						{request.submittedBy?.name || "Unknown"} (
						{request.submittedBy?.role || "Member"})
					</Typography>
					<Typography>
						<strong>📅 Submitted On:</strong>{" "}
						{new Date(request.createdAt).toLocaleDateString()}
					</Typography>
					<Typography>
						<strong>📧 Email:</strong> {request.submittedBy?.email || "N/A"}
					</Typography>
					<Typography>
						<strong>Status:</strong>{" "}
						<Chip
							label={request.requestStatus || "Pending"}
							color={
								request.requestStatus === "Approved"
									? "success"
									: request.requestStatus === "Rejected"
									? "error"
									: "warning"
							}
							className="ml-2"
						/>
					</Typography>
				</Box>

				<Divider className="mb-4" />

				{/* Request Details */}
				<Box className="mb-4">
					<Typography variant="h6">📄 Request Details</Typography>
					<Typography>
						<strong>📌 Type:</strong> {request.requestType}
					</Typography>
					<Typography>
						<strong>📝 Title:</strong> {request.title}
					</Typography>
					<Typography>
						<strong>📜 Description:</strong> {request.description}
					</Typography>
					<Typography>
						<strong>📅 Event Date:</strong>{" "}
						{request.eventDate || "Not specified"}
					</Typography>
					<Typography>
						<strong>📍 Location:</strong> {request.location || "Not specified"}
					</Typography>
				</Box>

				{/* Comments */}
				{request.comments?.length > 0 && (
					<Box className="mb-4">
						<Typography variant="h6">💬 Comments & Notes</Typography>
						<Box className="bg-gray-100 p-3 rounded-lg">
							{request.comments.map((comment, index) => (
								<Typography
									key={index}
									variant="body2"
									className="mb-1"
								>
									<strong>{comment?.commentBy?.fullName}:</strong>{" "}
									{comment.commentText}
									<span className="text-xs text-gray-500 ml-2">
										({new Date(comment.timestamp).toLocaleDateString("en-US")})
									</span>
								</Typography>
							))}
						</Box>
					</Box>
				)}

				{/* Add Comment */}
				<Box className="mb-4">
					<TextField
						fullWidth
						label="Add a Comment"
						variant="outlined"
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						multiline
						rows={3}
					/>
					<Button
						variant="contained"
						color="primary"
						onClick={handleAddComment}
						disabled={isSubmitting || !commentText.trim()}
						className="mt-2"
					>
						{isSubmitting ? "Adding..." : "Add Comment"}
					</Button>
				</Box>

				{/* Actions */}
				<Box className="flex justify-end space-x-3">
					{user.role === "Faculty" && (
						<>
							{request.requestStatus !== "Approved" &&
								request.requestStatus !== "Rejected" && (
									<Button
										variant="contained"
										color="success"
										onClick={() => handleStatusChange("Approved")}
									>
										Approve ✅
									</Button>
								)}

							<Button
								variant="contained"
								color="error"
								onClick={() => handleStatusChange("Rejected")}
								disabled={request.requestStatus === "Rejected"}
							>
								{request.requestStatus === "Rejected"
									? "Rejected ❌"
									: "Reject ❌"}
							</Button>
						</>
					)}
				</Box>
			</Paper>
		</DialogComponent>
	);
};

export default RequestDetails;
