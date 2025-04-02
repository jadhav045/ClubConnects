import React from "react";
import {
	TextField,
	Button,
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
import DialogComponent from "../common/DialogComponent";
// import DialogComponent from "./DialogComponent";

const CreateEventForm = ({ open, onClose, onSuccess }) => {
	const theme = useTheme();
	const { formData, handleChange, handleSubmit, setFormData } =
		useCreateEventForm(onSuccess, onClose);

	return (
		<DialogComponent
			title="Create New Event"
			open={open}
			onClose={onClose}
			actions={
				<>
					<Button
						variant="contained"
						color="secondary"
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							handleSubmit();
							onClose();
						}}
					>
						Create Event
					</Button>
				</>
			}
		>
			<Grid
				container
				spacing={4}
				sx={{ py: 2 }}
			>
				{/* Event Details */}
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
							<CategoryIcon sx={{ mr: 1, verticalAlign: "bottom" }} /> Event
							Details
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
							},
							{
								label: "Registration End Date",
								name: "registrationDeadline",
								type: "datetime-local",
								icon: <ScheduleIcon />,
								required: true,
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
								sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
							/>
						))}
					</Paper>
				</Grid>

				{/* Descriptions */}
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
							<DescriptionIcon sx={{ mr: 1, verticalAlign: "bottom" }} />{" "}
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
						/>
					</Paper>
				</Grid>

				{/* Event Schedule */}
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
							<ScheduleIcon sx={{ mr: 1, verticalAlign: "bottom" }} /> Event
							Schedule
						</Typography>
						<ScheduleResourceForm
							label="Schedule"
							data={formData.schedule}
							setData={(data) =>
								setFormData((prev) => ({ ...prev, schedule: data }))
							}
							fields={["time", "activity"]}
						/>
					</Paper>
				</Grid>
			</Grid>
		</DialogComponent>
	);
};

export default CreateEventForm;
