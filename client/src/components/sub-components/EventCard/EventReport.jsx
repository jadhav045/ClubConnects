import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	IconButton,
	Button,
	Typography,
	Box,
	CircularProgress,
	Alert,
} from "@mui/material";
import {
	Close as CloseIcon,
	Assessment,
	CloudDownload,
} from "@mui/icons-material";

import { EventReportService } from "../hooks/EventReportService";

const EventReport = ({ eventId, onClose }) => {
	const [loading, setLoading] = useState(false);
	const [report, setReport] = useState(null);
	const [error, setError] = useState(null);

	const handleGenerateReport = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await EventReportService.generateReport(eventId);
			setReport(response.report);
		} catch (err) {
			setError(err.message || "Failed to generate report");
		} finally {
			setLoading(false);
		}
	};

	const renderReport = () => (
		<Box
			sx={{
				fontFamily: "monospace",
				whiteSpace: "pre-wrap",
				p: 3,
				bgcolor: "background.paper",
				borderRadius: 1,
				boxShadow: 1,
			}}
		>
			{report?.text}
		</Box>
	);

	return (
		<Dialog
			open={true}
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
				<Box
					display="flex"
					alignItems="center"
					gap={1}
				>
					<Assessment />
					<Typography>Event Report</Typography>
				</Box>
				<IconButton
					color="inherit"
					onClick={onClose}
					size="small"
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent>
				{loading ? (
					<Box sx={{ p: 3, textAlign: "center" }}>
						<CircularProgress />
					</Box>
				) : error ? (
					<Alert
						severity="error"
						sx={{ m: 2 }}
					>
						{error}
					</Alert>
				) : !report ? (
					<Box sx={{ p: 3, textAlign: "center" }}>
						<Button
							variant="contained"
							startIcon={<Assessment />}
							onClick={handleGenerateReport}
						>
							Generate Report
						</Button>
					</Box>
				) : (
					<Box sx={{ mt: 2 }}>
						{renderReport()}
						<Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
							<Button
								startIcon={<CloudDownload />}
								variant="outlined"
								onClick={() => window.print()}
							>
								Download Report
							</Button>
						</Box>
					</Box>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default EventReport;
