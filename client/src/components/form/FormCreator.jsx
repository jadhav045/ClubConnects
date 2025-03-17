import React from "react";
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
	RadioGroup,
	Radio,
	Box,
	Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/system";
import { useFormHandlers, questionTypes } from "./FormCreaterFn";

const QuestionContainer = styled(Box)(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(2),
	marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
	marginTop: theme.spacing(2),
	marginBottom: theme.spacing(2),
}));
const FormCreator = ({ entityId, entityType, onClose }) => {
	console.log("Event Data:", entityId);
	const {
		formData,
		setFormData,
		addQuestion,
		handleQuestionChange,
		handleSubmit,
	} = useFormHandlers(entityId, entityType);
	return (
		<Container maxWidth="md">
			<Typography
				variant="h4"
				gutterBottom
			>
				Create New Form
			</Typography>

			<form onSubmit={handleSubmit}>
				<Grid
					container
					spacing={3}
				>
					{/* Entity Type */}
					<Grid
						item
						xs={12}
						sm={6}
					>
						<FormControl fullWidth>
							<InputLabel>Entity Type</InputLabel>
							<Select
								value={formData.entityType}
								onChange={(e) =>
									setFormData({ ...formData, entityType: e.target.value })
								}
							>
								<MenuItem value="Event">Event</MenuItem>
								<MenuItem value="Opportunity">Opportunity</MenuItem>
							</Select>
						</FormControl>
					</Grid>

					{/* Form Type */}
					<Grid
						item
						xs={12}
						sm={6}
					>
						<FormControl fullWidth>
							<InputLabel>Form Type</InputLabel>
							<Select
								value={formData.formType}
								onChange={(e) =>
									setFormData({ ...formData, formType: e.target.value })
								}
							>
								<MenuItem value="REGISTRATION">Registration</MenuItem>
								<MenuItem value="FEEDBACK">Feedback</MenuItem>
							</Select>
						</FormControl>
					</Grid>

					{/* Form Title */}
					<Grid
						item
						xs={12}
					>
						<TextField
							fullWidth
							label="Form Title"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
						/>
					</Grid>

					{/* Questions */}
					{formData.questions.map((question, index) => (
						<Grid
							item
							xs={12}
							key={index}
						>
							<QuestionContainer>
								{/* Question Type */}
								<FormControl
									fullWidth
									margin="normal"
								>
									<InputLabel>Question Type</InputLabel>
									<Select
										value={question.questionType}
										onChange={(e) =>
											handleQuestionChange(
												index,
												"questionType",
												e.target.value
											)
										}
									>
										{questionTypes.map((type) => (
											<MenuItem
												key={type.value}
												value={type.value}
											>
												{type.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								{/* Question Text */}
								<TextField
									fullWidth
									label="Question Text"
									value={question.questionText}
									onChange={(e) =>
										handleQuestionChange(index, "questionText", e.target.value)
									}
									margin="normal"
								/>

								{/* Options */}
								{["MULTIPLE_CHOICE", "CHECKBOX", "DROPDOWN"].includes(
									question.questionType
								) && (
									<TextField
										fullWidth
										label="Options (comma separated)"
										helperText="Separate options with commas"
										onChange={(e) =>
											handleQuestionChange(
												index,
												"options",
												e.target.value.split(",")
											)
										}
										margin="normal"
									/>
								)}

								{/* Required Checkbox */}
								<FormControlLabel
									control={
										<Checkbox
											checked={question.required}
											onChange={(e) =>
												handleQuestionChange(
													index,
													"required",
													e.target.checked
												)
											}
										/>
									}
									label="Required"
								/>
							</QuestionContainer>
						</Grid>
					))}

					{/* Add Question Button */}
					<Grid
						item
						xs={12}
					>
						<StyledButton
							variant="outlined"
							startIcon={<AddIcon />}
							onClick={addQuestion}
						>
							Add Question
						</StyledButton>
					</Grid>

					{/* Submit Button */}
					<Grid
						item
						xs={12}
					>
						<StyledButton
							type="submit"
							variant="contained"
							color="primary"
						>
							Create Form
						</StyledButton>
					</Grid>
				</Grid>
			</form>
			<button onClick={onClose}>Close</button>
		</Container>
	);
};

export default FormCreator;
