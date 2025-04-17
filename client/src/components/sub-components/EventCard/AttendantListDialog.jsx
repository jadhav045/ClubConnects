import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	CircularProgress,
	Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { API_URL, getToken } from "../../../routes/apiConfig";

const AttendanceListDialog = ({ open, onClose, event }) => {
	const [attendanceList, setAttendanceList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAttendanceList = async () => {
			try {
				setLoading(true);
				const token = getToken();
				const response = await axios.get(
					`${API_URL}/student/events/${event?._id}/attendant-list`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				if (response.data.success) {
					setAttendanceList(response.data.attendantList);
				}
			} catch (error) {
				console.error("Error fetching attendance list:", error);
				setError("Failed to fetch attendance list");
			} finally {
				setLoading(false);
			}
		};

		if (open && event?._id) {
			fetchAttendanceList();
		}
	}, [open, event?._id]);

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
				Attendance List - {event?.title}
				<IconButton
					onClick={onClose}
					sx={{ color: "white" }}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ mt: 2 }}>
				{loading ? (
					<div className="flex justify-center p-4">
						<CircularProgress />
					</div>
				) : error ? (
					<Alert severity="error">{error}</Alert>
				) : attendanceList.length === 0 ? (
					<Alert severity="info">No attendance records found</Alert>
				) : (
					<>
						<Typography
							variant="body2"
							color="text.secondary"
							mb={2}
						>
							Total Attendees: {attendanceList.length}
						</Typography>
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Marked At</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{attendanceList.map((record) => (
										<TableRow key={record._id}>
											<TableCell>{record.user.fullName}</TableCell>
											<TableCell>{record.user.email}</TableCell>
											<TableCell>
												{new Date(record.markedAt).toLocaleString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default AttendanceListDialog;