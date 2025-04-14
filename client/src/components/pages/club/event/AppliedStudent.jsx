import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";

const AppliedStudent = ({ open, onClose, appliedStudents }) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle>Applied Students</DialogTitle>
			<DialogContent>
				{appliedStudents.length > 0 ? (
					<List>
						{appliedStudents.map((student, index) => (
							<ListItem key={index}>
								<ListItemText
									primary={student.name}
									secondary={student.email}
								/>
							</ListItem>
						))}
					</List>
				) : (
					<p>No students have applied yet.</p>
				)}
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onClose}
					color="secondary"
				>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AppliedStudent;
