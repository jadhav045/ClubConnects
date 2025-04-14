import React from "react";
import { Dialog, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DynamicFeedbackForm from "./DynamicFeedbackForm";
// import DynamicFeedbackForm from "../../form/DynamicFeedbackForm";

const FeedbackDialog = ({ open, onClose, onSubmit, isLoading, event }) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
		>
			<DialogTitle
				sx={{
					bgcolor: "primary.main",
					color: "white",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				Event Feedback - {event?.title}
				<IconButton
					onClick={onClose}
					sx={{ color: "white" }}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DynamicFeedbackForm
				entityType="Event"
				entityId={event?._id}
				onClose={onClose}
			/>
		</Dialog>
	);
};

export default FeedbackDialog;
