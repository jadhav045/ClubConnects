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
	Paper,
	IconButton,
	ListItemText,
	InputAdornment,
	Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/system";
import { useFormHandlers, questionTypes } from "./FormCreaterFn";
import { DeleteIcon } from "lucide-react";

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
const FormCreator = ({ entityId, entityType, onClose, formType }) => {
	const {
		formData,
		setFormData,
		addQuestion,
		handleQuestionChange,
		handleSubmit,
		removeQuestion,
	} = useFormHandlers(entityId, entityType, formType);

	const handleRemoveQuestion = (index) => {
		if (window.confirm("Are you sure you want to remove this question?")) {
			removeQuestion(index);
		}
	};

	return (
		<Container
			maxWidth="md"
			sx={{ py: 3 }}
		>
			<Box sx={{ mb: 3, textAlign: "center" }}>
				<Typography
					variant="h5"
					component="h1"
					fontWeight={700}
				>
					{formType} Form
				</Typography>
				<Typography
					variant="subtitle2"
					color="text.secondary"
				>
					Build your custom form with multiple question types
				</Typography>
			</Box>

			<form onSubmit={handleSubmit}>
				<TextField
					fullWidth
					variant="outlined"
					label="Form Title"
					value={formData.title}
					onChange={(e) => setFormData({ ...formData, title: e.target.value })}
					sx={{ mb: 2 }}
					InputProps={{ style: { fontSize: "1.1rem" } }}
					required
				/>

				{formData.questions.map((question, index) => (
					<Paper
						key={index}
						elevation={0}
						sx={{
							mb: 2,
							p: 2,
							border: "1px solid",
							borderColor: "divider",
							borderRadius: 2,
						}}
					>
						<Box
							sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
						>
							<Typography
								variant="subtitle2"
								color="text.secondary"
							>
								Question {index + 1}
							</Typography>
							<IconButton
								onClick={() => handleRemoveQuestion(index)}
								size="small"
								color="error"
							>
								<DeleteIcon fontSize="small" />
							</IconButton>
						</Box>

						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={12}
								md={5}
							>
								<FormControl
									fullWidth
									size="small"
								>
									<InputLabel>Type</InputLabel>
									<Select
										value={question.questionType}
										onChange={(e) =>
											handleQuestionChange(
												index,
												"questionType",
												e.target.value
											)
										}
										label="Type"
									>
										{questionTypes.map((type) => (
											<MenuItem
												key={type.value}
												value={type.value}
											>
												<ListItemText primary={type.label} />
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							<Grid
								item
								xs={12}
								md={7}
							>
								<TextField
									fullWidth
									variant="outlined"
									label="Question"
									value={question.questionText}
									onChange={(e) =>
										handleQuestionChange(index, "questionText", e.target.value)
									}
									required
								/>
							</Grid>

							{["MULTIPLE_CHOICE", "CHECKBOX", "DROPDOWN"].includes(
								question.questionType
							) && (
								<Grid
									item
									xs={12}
								>
									<TextField
										fullWidth
										variant="outlined"
										label="Options (comma-separated)"
										onChange={(e) =>
											handleQuestionChange(
												index,
												"options",
												e.target.value.split(",")
											)
										}
										InputProps={{
											endAdornment: question.options?.length > 0 && (
												<InputAdornment position="end">
													<Chip
														label={`${question.options.length} options`}
														size="small"
													/>
												</InputAdornment>
											),
										}}
									/>
								</Grid>
							)}

							<Grid
								item
								xs={12}
							>
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
											color="primary"
										/>
									}
									label="Required"
								/>
							</Grid>
						</Grid>
					</Paper>
				))}

				<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={addQuestion}
						size="small"
					>
						Add Question
					</Button>

					<Box sx={{ display: "flex", gap: 1 }}>
						<Button
							variant="outlined"
							onClick={onClose}
							sx={{ minWidth: 100 }}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							sx={{ minWidth: 120 }}
						>
							Create Form
						</Button>
					</Box>
				</Box>
			</form>
		</Container>
	);
};

export default FormCreator;
