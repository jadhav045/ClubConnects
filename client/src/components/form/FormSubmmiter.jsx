import React, { useState } from "react";
import {
	Container,
	Typography,
	TextField,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Checkbox,
	FormControlLabel,
	Radio,
	RadioGroup,
	Box,
	Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

// Form Submission Component
export const FormSubmitter = ({ formId }) => {
	const [formData, setFormData] = useState({
		answers: [],
		userId: "67c9f49d5563ae44383c1f33", // Replace with actual user ID
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("http://localhost:3002/form/submit", {
				formId,
				entityType: "Event", // Get from form data
				entityId: "67cf2f3cf3f55e18f2da55d0", // Get from form data
				userId: formData.userId,
				answers: formData.answers,
			});
			alert("Form submitted successfully!");
		} catch (error) {
			alert(error.response?.data?.error || "Error submitting form");
		}
	};

	// In a real app, you would fetch the form structure first
	const [formStructure] = useState({
		questions: [
			{ questionType: "TEXT", questionText: "Full Name", required: true },
			{
				questionType: "MULTIPLE_CHOICE",
				questionText: "Age Group",
				options: ["Under 18", "18-25", "26-35"],
			},
		],
	});

	const handleAnswerChange = (index, value) => {
		const newAnswers = [...formData.answers];
		newAnswers[index] = value;
		setFormData({ ...formData, answers: newAnswers });
	};

	return (
		<Container maxWidth="md">
			<Typography
				variant="h4"
				gutterBottom
			>
				Form Submission
			</Typography>
			<form onSubmit={handleSubmit}>
				{formStructure.questions.map((question, index) => (
					<Box
						key={index}
						mb={3}
					>
						<Typography variant="h6">{question.questionText}</Typography>

						{question.questionType === "TEXT" && (
							<TextField
								fullWidth
								required={question.required}
								onChange={(e) => handleAnswerChange(index, e.target.value)}
							/>
						)}

						{question.questionType === "MULTIPLE_CHOICE" && (
							<FormControl component="fieldset">
								<RadioGroup
									onChange={(e) => handleAnswerChange(index, e.target.value)}
								>
									{question.options.map((option, i) => (
										<FormControlLabel
											key={i}
											value={option}
											control={<Radio />}
											label={option}
										/>
									))}
								</RadioGroup>
							</FormControl>
						)}

						{/* Add other question types here */}
					</Box>
				))}

				<Button
					type="submit"
					variant="contained"
					color="primary"
				>
					Submit Form
				</Button>
			</form>
		</Container>
	);
};
