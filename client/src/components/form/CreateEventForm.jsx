// import React from "react";
import { TextField, InputAdornment } from "@mui/material";

import React from "react";
import {
	Grid,
	Typography,
	Paper,
	Button,
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

import DialogComponent from "../common/DialogComponent";
import ScheduleResourceForm from "./ScheduleResourceForm";
import { useCreateEventForm } from "./CreateEventFormFn";
// import FormField from "../common/FormField";

const FormField = ({
	label,
	name,
	value,
	onChange,
	icon,
	type = "text",
	required = false,
	multiline = false,
	rows = 1,
}) => {
	return (
		<TextField
			fullWidth
			label={label}
			name={name}
			value={value}
			onChange={onChange}
			type={type}
			required={required}
			multiline={multiline}
			rows={rows}
			variant="outlined"
			margin="normal"
			InputProps={{
				startAdornment: icon && (
					<InputAdornment position="start">{icon}</InputAdornment>
				),
			}}
			sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
		/>
	);
};

const CreateEventForm = ({ open, onClose, onSuccess }) => {
	const theme = useTheme();
	const { formData, handleChange, handleSubmit, setFormData } =
		useCreateEventForm(onSuccess, onClose);

	const handleFormSubmit = () => {
		const success = handleSubmit();
		if (success) onClose(); // Only close on success
	};

	return (
		<DialogComponent
			title="Create New Event"
			open={open}
			onClose={onClose}
			actions={
				<>
					<Button
						variant="outlined"
						color="secondary"
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleFormSubmit}
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
							},
							{
								label: "Registration End Date",
								name: "registrationDeadline",
								type: "datetime-local",
								icon: <ScheduleIcon />,
								required: true,
							},
						].map((field) => (
							<FormField
								key={field.name}
								{...field}
								value={formData[field.name]}
								onChange={handleChange}
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
							<DescriptionIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
							Descriptions
						</Typography>

						<FormField
							label="Short Description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							multiline
							rows={3}
							icon={<DescriptionIcon />}
						/>

						<FormField
							label="Detailed Description"
							name="detailedDescription"
							value={formData.detailedDescription}
							onChange={handleChange}
							multiline
							rows={6}
							icon={<DescriptionIcon />}
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
							fields={["time", "activity"]}
						/>
					</Paper>
				</Grid>
			</Grid>
		</DialogComponent>
	);
};

export default CreateEventForm;
