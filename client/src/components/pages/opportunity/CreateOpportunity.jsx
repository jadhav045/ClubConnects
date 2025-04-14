import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
	Box,
	TextField,
	Button,
	Typography,
	MenuItem,
	IconButton,
	Paper,
	Divider,
	Alert,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { addDays } from "date-fns";

const OPPORTUNITY_TYPES = [
	"Industry Project",
	"Internship",
	"Job",
	"Research",
	"Other",
];
const ROUND_TYPES = [
	"SCREENING",
	"INTERVIEW",
	"QUIZ",
	"DSA",
	"PROJECT",
	"PAPER",
];
const TEST_TYPES = ["TECHNICAL", "CODING", "APTITUDE", "HR", "null"];

const CreateOpportunity = () => {
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		type: OPPORTUNITY_TYPES[0],
		deadline: addDays(new Date(), 7), // Default deadline 7 days from now
		rounds: [
			{
				type: ROUND_TYPES[0],
				testType: "null",
				deadline: addDays(new Date(), 1), // Default round deadline 1 day from now
			},
		],
	});

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleRoundChange = (index, field, value) => {
		const updatedRounds = [...formData.rounds];
		updatedRounds[index] = {
			...updatedRounds[index],
			[field]: value,
		};
		setFormData({ ...formData, rounds: updatedRounds });
	};

	const addRound = () => {
		setFormData({
			...formData,
			rounds: [
				...formData.rounds,
				{
					type: ROUND_TYPES[0],
					testType: null,
					deadline: addDays(new Date(), 1), // Default round deadline 1 day from now
				},
			],
		});
	};

	const removeRound = (index) => {
		const updatedRounds = formData.rounds.filter((_, i) => i !== index);
		setFormData({ ...formData, rounds: updatedRounds });
	};

	const handleDeadlineChange = (newValue) => {
		setFormData({
			...formData,
			deadline: newValue,
		});
	};

	const handleRoundDeadlineChange = (index, newValue) => {
		const updatedRounds = [...formData.rounds];
		updatedRounds[index] = {
			...updatedRounds[index],
			deadline: newValue,
		};
		setFormData({ ...formData, rounds: updatedRounds });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await axios.post(
				"http://localhost:3002/opportunities/",
				formData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);

			if (response.data) {
				navigate("/alumni/opportunities");
			}
		} catch (error) {
			setError(error.response?.data?.message || "Failed to create opportunity");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{ maxWidth: 800, mx: "auto", p: 3 }}
		>
			<Typography
				variant="h4"
				gutterBottom
			>
				Create New Opportunity
			</Typography>

			{error && (
				<Alert
					severity="error"
					sx={{ mb: 2 }}
				>
					{error}
				</Alert>
			)}

			<Paper
				elevation={3}
				sx={{ p: 3, mb: 3 }}
			>
				<TextField
					name="title"
					label="Opportunity Title"
					value={formData.title}
					onChange={handleInputChange}
					fullWidth
					required
					sx={{ mb: 2 }}
				/>

				<TextField
					name="description"
					label="Description"
					value={formData.description}
					onChange={handleInputChange}
					multiline
					rows={4}
					fullWidth
					required
					sx={{ mb: 2 }}
				/>

				<TextField
					name="type"
					label="Opportunity Type"
					value={formData.type}
					onChange={handleInputChange}
					select
					fullWidth
					required
					sx={{ mb: 2 }}
				>
					{OPPORTUNITY_TYPES.map((type) => (
						<MenuItem
							key={type}
							value={type}
						>
							{type.replace("_", " ")}
						</MenuItem>
					))}
				</TextField>

				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DateTimePicker
						label="Application Deadline"
						value={formData.deadline}
						onChange={handleDeadlineChange}
						minDateTime={new Date()}
						renderInput={(params) => (
							<TextField
								{...params}
								required
								fullWidth
								sx={{ mb: 2 }}
							/>
						)}
					/>
				</LocalizationProvider>
			</Paper>

			<Typography
				variant="h6"
				gutterBottom
			>
				Rounds
			</Typography>

			{formData.rounds.map((round, index) => (
				<Paper
					key={index}
					elevation={3}
					sx={{ p: 3, mb: 2 }}
				>
					<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
						<TextField
							label="Round Type"
							value={round.type}
							onChange={(e) => handleRoundChange(index, "type", e.target.value)}
							select
							fullWidth
							required
						>
							{ROUND_TYPES.map((type) => (
								<MenuItem
									key={type}
									value={type}
								>
									{type}
								</MenuItem>
							))}
						</TextField>

						<TextField
							label="Test Type (Optional)"
							value={round.testType}
							onChange={(e) =>
								handleRoundChange(index, "testType", e.target.value)
							}
							select
							fullWidth
						>
							{TEST_TYPES.map((type) => (
								<MenuItem
									key={type || "none"}
									value={type}
								>
									{type || "None"}
								</MenuItem>
							))}
						</TextField>

						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateTimePicker
								label="Round Deadline"
								value={round.deadline}
								onChange={(newValue) =>
									handleRoundDeadlineChange(index, newValue)
								}
								minDateTime={
									index === 0
										? new Date()
										: formData.rounds[index - 1]?.deadline
								}
								renderInput={(params) => (
									<TextField
										{...params}
										required
										fullWidth
									/>
								)}
							/>
						</LocalizationProvider>

						{index > 0 && (
							<IconButton
								color="error"
								onClick={() => removeRound(index)}
							>
								<DeleteIcon />
							</IconButton>
						)}
					</Box>
				</Paper>
			))}

			<Button
				startIcon={<AddIcon />}
				onClick={addRound}
				variant="outlined"
				sx={{ mb: 3 }}
			>
				Add Round
			</Button>

			<Divider sx={{ my: 3 }} />

			<Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
				<Button
					variant="outlined"
					onClick={() => navigate("/opportunities")}
					disabled={loading}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="contained"
					disabled={loading}
				>
					{loading ? "Creating..." : "Create Opportunity"}
				</Button>
			</Box>
		</Box>
	);
};

export default CreateOpportunity;
