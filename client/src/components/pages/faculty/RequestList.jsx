import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import { useState } from "react";
import { setSelectedRequests } from "../../../store/slice/requestSlice";
import RequestCard from "../../sub-components/RequestCard";

import RequestDetails from "../../sub-components/RequestDetails";
const RequestList = () => {
	const dispatch = useDispatch();
	const { selectedRequest, requests } = useSelector((store) => store.request);
	const [open, setOpen] = useState(false);

	const onViewDetails = (request) => {
		dispatch(setSelectedRequests(request)); // Update selected request
		setOpen(true); // Open the dialog
	};

	const handleClose = () => {
		setOpen(false); // Close the dialog
	};

	return (
		<div>
			{requests.map((request) => (
				<RequestCard
					key={request._id}
					request={request}
					onViewDetails={() => onViewDetails(request)}
				/>
			))}

			{/* Dialog for Full Request Details */}
			<Dialog
				open={open}
				onClose={handleClose}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle>Request Details</DialogTitle>
				<DialogContent>
					{selectedRequest ? (
						<RequestDetails request={selectedRequest} />
					) : (
						<p>No request selected</p>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default RequestList;

// Now, RequestCard will handle displaying each request, and clicking "View Full Detail" opens the dialog with full request details! 🚀
