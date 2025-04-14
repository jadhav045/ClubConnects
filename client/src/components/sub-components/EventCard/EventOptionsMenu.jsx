import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { ListAlt, Assignment, Feedback, Share } from "@mui/icons-material";

const EventOptionsMenu = ({
	anchorEl,
	handleMenuClose,
	isOrganizer,
	event,
	handleViewResponses,
	handleCreateForm,
	handleDialogOpen,
}) => {
	return (
		<Menu
			anchorEl={anchorEl}
			open={!!anchorEl}
			onClose={handleMenuClose}
			PaperProps={{
				elevation: 3,
				sx: { borderRadius: "8px", minWidth: "180px" },
			}}
		>
			{isOrganizer && (
				<>
					{event.registrationForm ? (
						<MenuItem
							onClick={() => handleViewResponses("REGISTRATION")}
							className="py-2"
						>
							<ListAlt
								fontSize="small"
								className="mr-3 text-indigo-600"
							/>
							<span>View Registrations</span>
						</MenuItem>
					) : (
						<MenuItem
							onClick={() => handleCreateForm("REGISTRATION")}
							className="py-2"
						>
							<Assignment
								fontSize="small"
								className="mr-3 text-indigo-600"
							/>
							<span>Create Registration Form</span>
						</MenuItem>
					)}

					{event.feedbackForm ? (
						<MenuItem
							onClick={() => handleViewResponses("FEEDBACK")}
							className="py-2"
						>
							<Feedback
								fontSize="small"
								className="mr-3 text-indigo-600"
							/>
							<span>View Feedback</span>
						</MenuItem>
					) : (
						<MenuItem
							onClick={() => handleCreateForm("FEEDBACK")}
							className="py-2"
						>
							<Feedback
								fontSize="small"
								className="mr-3 text-indigo-600"
							/>
							<span>Create Feedback Form</span>
						</MenuItem>
					)}

					<MenuItem
						onClick={handleDialogOpen}
						className="py-2"
					>
						<Share
							fontSize="small"
							className="mr-3 text-indigo-600"
						/>
						<span>Send Reminder</span>
					</MenuItem>

					<div className="border-t border-gray-100 my-1"></div>
				</>
			)}

			<MenuItem
				onClick={() => console.log(event.attendance)}
				className="py-2"
			>
				<Share
					fontSize="small"
					className="mr-3 text-indigo-600"
				/>
				<span>Share Event</span>
			</MenuItem>
		</Menu>
	);
};

export const UploadReportModal = ({
	show,
	onClose,
	onSubmit,
	onFileChange,
}) => {
	if (!show) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
				<h2 className="text-xl font-semibold mb-4">Upload Event Report</h2>
				<form onSubmit={onSubmit}>
					<input
						type="file"
						name="file"
						onChange={onFileChange}
						className="mb-4"
						required
					/>
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EventOptionsMenu;
