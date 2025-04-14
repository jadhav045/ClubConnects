import { Button, Chip, Tooltip } from "@mui/material";
import React, { useState } from "react";
import RequestDetails from "./RequestDetails";
import { useSelector } from "react-redux";

const RequestCard = ({ request, userRole }) => {
	const [openDialog, setOpenDialog] = useState(false);

	const handleDialogOpen = () => setOpenDialog(true);
	const handleDialogClose = () => setOpenDialog(false);

	const { user } = useSelector((store) => store.auth);

	const getStatusColor = (status) => {
		switch (status) {
			case "Approved":
				return "text-green-600 bg-green-100";
			case "Rejected":
				return "text-red-600 bg-red-100";
			case "Pending":
				return "text-yellow-600 bg-yellow-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	return (
		<div className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition-all border border-gray-200">
			{/* Header Section */}
			<div className="flex justify-between items-center mb-4">
				<p className="text-sm text-gray-500">
					Date: {new Date(request.createdAt).toLocaleDateString()}
				</p>
				<Chip
					label={request.requestStatus || "Pending"}
					className={`px-3 py-1 font-medium ${getStatusColor(
						request.requestStatus
					)}`}
				/>
			</div>

			{/* Request Title */}
			<h3 className="text-xl font-semibold text-blue-600 mb-2">
				{request.title}
			</h3>

			{/* Request Details */}
			<div className="text-sm text-gray-700 space-y-1">
				<p>
					<strong>Club:</strong> {request.clubId?.clubName || "N/A"}
				</p>
				<p>
					<strong>Type:</strong> {request.requestType}
				</p>
				<p>
					<strong>Submitted By:</strong>{" "}
					{request.submittedBy?.name || "Unknown"}
				</p>
			</div>

			{/* Description */}
			<p className="text-sm text-gray-800 mt-3">
				<strong>Description:</strong> {request.description}
			</p>

			{/* Attachment (if available) */}
			{request.attachment && (
				<p className="text-sm text-blue-500 mt-2">
					📎{" "}
					<a
						href={request.attachment}
						target="_blank"
						rel="noopener noreferrer"
					>
						View Attachment
					</a>
				</p>
			)}

			<hr className="my-4" />

			{/* Action Buttons */}
			<div className="flex justify-end space-x-4">
				<Button
					variant="outlined"
					onClick={handleDialogOpen}
				>
					View Details
				</Button>

				{/* Admin Controls */}
				{userRole === "admin" && request.requestStatus === "Pending" && (
					<>
						<Tooltip title="Approve the request">
							<Button
								variant="contained"
								color="success"
							>
								Approve
							</Button>
						</Tooltip>

						<Tooltip title="Reject the request">
							<Button
								variant="contained"
								color="error"
							>
								Reject
							</Button>
						</Tooltip>
					</>
				)}

				{/* Student View */}
				{userRole === "student" && (
					<Tooltip title="Only admins can update the status">
						<Button
							variant="outlined"
							disabled
						>
							Status: {request.requestStatus || "Pending"}
						</Button>
					</Tooltip>
				)}
			</div>

			{/* Request Details Dialog */}
			<RequestDetails
				open={openDialog}
				onClose={handleDialogClose}
				request={request}
			/>
		</div>
	);
};

export default RequestCard;
