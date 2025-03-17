import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setSelectedRequests } from "../../../../store/slice/requestSlice";
import RequestCard from "../../../sub-components/RequestCard";

const PendingRequests = () => {
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
		<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
			{requests
				.filter((request) => request.requestStatus === "Pending") // Filter pending requests
				.map((request) => (
					<div
						key={request._id}
						className="transform transition-transform duration-200 hover:scale-105"
					>
						<RequestCard
							request={request}
							onViewDetails={() => onViewDetails(request)}
						/>
					</div>
				))}
		</div>
	);
};

export default PendingRequests;
