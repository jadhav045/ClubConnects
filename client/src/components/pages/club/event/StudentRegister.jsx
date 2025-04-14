import { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
} from "@mui/material";

const StudentRegister = ({ open, onClose, onRegister }) => {
	const [studentName, setStudentName] = useState("");
	const [email, setEmail] = useState("");

	// Handle form submission
	const handleSubmit = () => {
		onRegister({ studentName, email }); // Send data to parent component
		setStudentName("");
		setEmail("");
		onClose(); // Close dialog after submission
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle>Register for Event</DialogTitle>
			<DialogContent>
				<TextField
					label="Your Name"
					fullWidth
					value={studentName}
					onChange={(e) => setStudentName(e.target.value)}
					margin="normal"
				/>
				<TextField
					label="Your Email"
					fullWidth
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					margin="normal"
				/>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onClose}
					color="secondary"
				>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					color="primary"
				>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default StudentRegister;
