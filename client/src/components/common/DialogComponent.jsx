import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from "@mui/material";

const DialogComponent = ({ title, open, onClose, children, actions }) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{children}</DialogContent>
			<DialogActions>
				{actions || <Button onClick={onClose}>Close</Button>}
			</DialogActions>
		</Dialog>
	);
};

export default DialogComponent;
