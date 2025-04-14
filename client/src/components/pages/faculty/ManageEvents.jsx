import React, { useState } from "react";
import {
	Tabs,
	Tab,
	Typography,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import useAllRequests from "../../../hooks/useAllRequests";

import PendingRequests from "./manageEvent/PendingRequests";
import ApprovedEvents from "./manageEvent/ApprovedEvents";
import RejectedEvents from "./manageEvent/RejectedEvents";
import RequestComponent from "../../form/RequestComponent";

const ManageEvents = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [open, setOpen] = useState(false);

	const dispatch = useDispatch();
	const { requests } = useSelector((store) => store.request);
	const { user } = useSelector((store) => store.auth);
	useAllRequests(dispatch);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<div className="p-4">
			<Typography
				variant="h4"
				gutterBottom
			>
				Manage Club Events
			</Typography>

			{/* Show "New Request" button only for students */}
			{user.role === "Student" && (
				<Button
					variant="contained"
					color="primary"
					onClick={handleOpen}
				>
					New Request
				</Button>
			)}

			{/* Dialog for creating new request */}
			<Dialog
				open={open}
				onClose={handleClose}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle>Create New Request</DialogTitle>
				<DialogContent>
					<RequestComponent />
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleClose}
						color="secondary"
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>

			<Tabs
				value={activeTab}
				onChange={(e, newValue) => setActiveTab(newValue)}
				className="mt-4"
			>
				<Tab label="Pending Requests" />
				<Tab label="Approved Events" />
				<Tab label="Rejected Events" />
			</Tabs>

			<div className="mt-4">
				{activeTab === 0 && <PendingRequests />}
				{activeTab === 1 && <ApprovedEvents />}
				{activeTab === 2 && <RejectedEvents />}
			</div>
		</div>
	);
};

export default ManageEvents;
