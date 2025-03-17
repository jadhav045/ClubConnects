import React from "react";
import {
	TextField,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Typography,
	Paper,
	InputAdornment,
	useTheme,
} from "@mui/material";
import {
	Event as EventIcon,
	Schedule as ScheduleIcon,
	Description as DescriptionIcon,
	Link as LinkIcon,
	LocationOn as LocationIcon,
	Category as CategoryIcon,
} from "@mui/icons-material";

import ScheduleResourceForm from "./ScheduleResourceForm";
import { useCreateEventForm } from "./CreateEventFormFn";

const CreateEventForm = ({ open, onClose, onSuccess }) => {
	const theme = useTheme(); // Import MUI theme

	// Using the custom hook
	const { formData, handleChange, handleSubmit, setFormData } =
		useCreateEventForm(onSuccess);

	return (
		<Dialog
			open={open} // Controlled by parent component
			onClose={onClose} // Handle both backdrop click and close actions
			fullWidth
			maxWidth="md"
			PaperProps={{
				sx: {
					borderRadius: 4,
					background: theme.palette.background.paper,
				},
			}}
		>
			<DialogTitle
				sx={{
					bgcolor: theme.palette.primary.main,
					color: "white",
					py: 3,
					borderTopLeftRadius: 4,
					borderTopRightRadius: 4,
				}}
			>
				<Typography
					variant="h4"
					sx={{ fontWeight: 600 }}
				>
					<EventIcon sx={{ verticalAlign: "middle", mr: 2 }} />
					Create New Event
				</Typography>
			</DialogTitle>

			<DialogContent sx={{ py: 4, px: 6 }}>
				<Grid
					container
					spacing={4}
				>
					{/* Main Event Details */}
					<Grid
						item
						xs={12}
						md={6}
					>
						<Paper
							elevation={2}
							sx={{ p: 3, borderRadius: 3 }}
						>
							<Typography
								variant="h6"
								sx={{ mb: 3, color: theme.palette.primary.main }}
							>
								<CategoryIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
								Event Details
							</Typography>

							{[
								{
									label: "Event Title",
									name: "title",
									icon: <EventIcon />,
									required: true,
								},
								{
									label: "Event Type",
									name: "eventType",
									icon: <CategoryIcon />,
									required: true,
								},
								{
									label: "Location",
									name: "location",
									icon: <LocationIcon />,
									required: true,
								},
								{
									label: "Date & Time",
									name: "eventDateTime",
									type: "datetime-local",
									icon: <ScheduleIcon />,
									required: true,
									InputLabelProps: { shrink: true },
								},
								{
									label: "Registration End Date",
									name: "registrationDeadline",
									type: "datetime-local",
									icon: <ScheduleIcon />,
									required: true,
									InputLabelProps: { shrink: true },
								},
							].map((field) => (
								<TextField
									key={field.name}
									fullWidth
									label={field.label}
									name={field.name}
									value={formData[field.name]}
									onChange={handleChange}
									variant="outlined"
									margin="normal"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												{field.icon}
											</InputAdornment>
										),
									}}
									type={field.type || "text"}
									required={field.required}
									sx={{
										"& .MuiOutlinedInput-root": {
											borderRadius: 2,
											transition: "all 0.3s ease",
											"&:hover": {
												backgroundColor: theme.palette.action.hover,
											},
										},
									}}
								/>
							))}
						</Paper>
					</Grid>

					{/* Descriptions and Links */}
					<Grid
						item
						xs={12}
						md={6}
					>
						<Paper
							elevation={2}
							sx={{ p: 3, borderRadius: 3 }}
						>
							<Typography
								variant="h6"
								sx={{ mb: 3, color: theme.palette.primary.main }}
							>
								<DescriptionIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
								Descriptions
							</Typography>

							<TextField
								label="Short Description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								fullWidth
								multiline
								rows={4}
								variant="outlined"
								margin="normal"
								sx={{
									"& .MuiOutlinedInput-root": {
										borderRadius: 2,
										transition: "all 0.3s ease",
									},
								}}
							/>

							<TextField
								label="Detailed Description"
								name="detailedDescription"
								value={formData.detailedDescription}
								onChange={handleChange}
								fullWidth
								multiline
								rows={4}
								variant="outlined"
								margin="normal"
								sx={{
									"& .MuiOutlinedInput-root": {
										borderRadius: 2,
										transition: "all 0.3s ease",
									},
								}}
							/>

							<TextField
								label="Registration Link"
								name="registerLink"
								value={formData.registerLink}
								onChange={handleChange}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LinkIcon />
										</InputAdornment>
									),
								}}
								sx={{
									mt: 2,
									"& .MuiOutlinedInput-root": {
										borderRadius: 2,
										transition: "all 0.3s ease",
									},
								}}
							/>
						</Paper>
					</Grid>

					{/* Schedule Section */}
					<Grid
						item
						xs={12}
					>
						<Paper
							elevation={2}
							sx={{ p: 3, borderRadius: 3, bgcolor: theme.palette.grey[50] }}
						>
							<Typography
								variant="h6"
								sx={{ mb: 3, color: theme.palette.secondary.main }}
							>
								<ScheduleIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
								Event Schedule
							</Typography>
							<ScheduleResourceForm
								label="Schedule"
								data={formData.schedule}
								setData={(data) =>
									setFormData((prev) => ({ ...prev, schedule: data }))
								}
								fields={["time", "activity", "speaker"]}
							/>
						</Paper>
					</Grid>
				</Grid>
			</DialogContent>

			<DialogActions sx={{ px: 6, py: 3 }}>
				<Button
					variant="contained"
					color="secondary"
					onClick={onClose} // Changed to onClose
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						handleSubmit();
						onClose(); // Close after submission
					}}
				>
					Create Event
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateEventForm;
