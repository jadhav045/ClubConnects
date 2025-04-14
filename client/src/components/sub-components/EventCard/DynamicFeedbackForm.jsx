import React, { useState, useEffect } from "react";
import {
	Button,
	Container,
	Typography,
	FormControl,
	FormLabel,
	CircularProgress,
	Alert,
	Box,
	Stack,
	RadioGroup,
	FormControlLabel,
	Radio,
	Checkbox,
	Select,
	MenuItem,
	Rating as MuiRating,
	TextField,
	Grid,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
// import { getToken } from "../../routes/apiConfig";
import axios from "axios";

import { getToken } from "../../../routes/apiConfig";

// Wrapper Component for Questions
const QuestionWrapper = ({ children, required, label }) => (
	<FormControl
		fullWidth
		margin="normal"
		required={required}
		component="fieldset"
	>
		<FormLabel
			component="legend"
			sx={{ fontWeight: 600, fontSize: "1.1rem" }}
		>
			{label}{" "}
			{required && (
				<Typography
					component="span"
					color="error"
				>
					*
				</Typography>
			)}
		</FormLabel>
		<Box mt={1}>{children}</Box>
	</FormControl>
);

// Text Input Question
const TextQuestion = ({
	value,
	onChange,
	required,
	placeholder = "Type your answer...",
}) => (
	<TextField
		fullWidth
		value={value}
		onChange={(e) => onChange(e.target.value)}
		variant="outlined"
		required={required}
		placeholder={placeholder}
		sx={{ bgcolor: "white", borderRadius: 1 }}
	/>
);

// Multiple Choice (Radio Button) Question
const MultipleChoiceQuestion = ({ value, onChange, options }) => (
	<RadioGroup
		value={value}
		onChange={(e) => onChange(e.target.value)}
	>
		{options.map((option) => (
			<FormControlLabel
				key={option}
				value={option}
				control={<Radio color="primary" />}
				label={option}
				sx={{ mt: 0.5 }}
			/>
		))}
	</RadioGroup>
);

// Checkbox (Multiple Selection) Question
const CheckboxQuestion = ({ value = [], onChange, options }) => (
	<Stack spacing={1}>
		{options.map((option) => (
			<FormControlLabel
				key={option}
				control={
					<Checkbox
						checked={value.includes(option)}
						onChange={(e) => {
							const newValue = e.target.checked
								? [...value, option]
								: value.filter((v) => v !== option);
							onChange(newValue);
						}}
						color="primary"
					/>
				}
				label={option}
			/>
		))}
	</Stack>
);

// Dropdown (Select) Question
const DropdownQuestion = ({ value, onChange, options }) => (
	<Select
		fullWidth
		value={value}
		onChange={(e) => onChange(e.target.value)}
		displayEmpty
		sx={{ bgcolor: "white", borderRadius: 1 }}
	>
		<MenuItem
			value=""
			disabled
		>
			Select an option
		</MenuItem>
		{options.map((option) => (
			<MenuItem
				key={option}
				value={option}
			>
				{option}
			</MenuItem>
		))}
	</Select>
);

// Rating Question
const RatingQuestion = ({ value, onChange }) => (
	<MuiRating
		precision={0.5}
		value={Number(value)}
		onChange={(_, newValue) => onChange(newValue)}
		size="large"
		sx={{ mt: 1 }}
	/>
);
const useFeedbackForm = (entityType, entityId) => {
	const [formData, setFormData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchForm = async () => {
		try {
			setLoading(true);
			const response = await axios.get(
				`http://localhost:3002/form/${entityType}/${entityId}?formType=FEEDBACK`
			);

			if (response.data?.success && response.data?.form) {
				setFormData(response.data.form);
				return {
					form: response.data.form,
					questions: response.data.form.questions || [],
				};
			} else {
				throw new Error(response.data?.message || "No feedback form found");
			}
		} catch (err) {
			console.error("Error fetching feedback form:", err);
			setError(err.message);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { formData, loading, error, fetchForm };
};

const DynamicFeedbackForm = ({ entityType, entityId, onClose }) => {
	const { user } = useSelector((store) => store.auth);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const [answers, setAnswers] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const { formData, loading, error, fetchForm } = useFeedbackForm(
		entityType,
		entityId
	);

	useEffect(() => {
		const loadForm = async () => {
			const result = await fetchForm();
			if (result?.form?.questions) {
				const initialAnswers = result.form.questions.reduce(
					(acc, q) => ({
						...acc,
						[q._id]: q.questionType === "CHECKBOX" ? [] : "",
					}),
					{}
				);
				setAnswers(initialAnswers);
			}
		};
		loadForm();
	}, [entityType, entityId]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate required fields
		const missingRequired = formData?.questions
			.filter((q) => q.required)
			.some((q) => {
				const answer = answers[q._id];
				return (
					!answer ||
					(Array.isArray(answer) && answer.length === 0) ||
					(!Array.isArray(answer) && answer.trim() === "")
				);
			});

		if (missingRequired) {
			toast.error("Please fill all required fields");
			return;
		}

		try {
			setSubmitting(true);
			const token = getToken();

			const formattedAnswers = Object.entries(answers).map(
				([questionId, value]) => {
					const question = formData.questions.find((q) => q._id === questionId);
					return {
						questionId,
						value,
						question: question?.label || "",
					};
				}
			);

			const response = await axios.post(
				`http://localhost:3002/form/submit`,
				{
					formId: formData._id,
					entityType,
					entityId,
					userId: user?._id,
					answers: formattedAnswers,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				toast.success("Feedback submitted successfully!");
				onClose?.();
			}
		} catch (err) {
			console.error("Error submitting feedback:", err);
			toast.error(err.response?.data?.message || "Failed to submit feedback");
		} finally {
			setSubmitting(false);
		}
	};

	const renderQuestion = (question) => {
		const value = answers[question._id] || "";
		const props = {
			value,
			onChange: (newValue) =>
				setAnswers((prev) => ({
					...prev,
					[question._id]: newValue,
				})),
			required: question.required,
			options: question.options || [],
		};

		switch (question.questionType) {
			case "TEXT":
				return <TextQuestion {...props} />;
			case "MULTIPLE_CHOICE":
				return <MultipleChoiceQuestion {...props} />;
			case "CHECKBOX":
				return <CheckboxQuestion {...props} />;
			case "DROPDOWN":
				return <DropdownQuestion {...props} />;
			case "RATING":
				return <RatingQuestion {...props} />;
			default:
				return <div>Unsupported question type</div>;
		}
	};

	if (loading) return <CircularProgress />;
	if (error) return <Alert severity="error">{error}</Alert>;
	if (!formData)
		return <Alert severity="info">No feedback form available</Alert>;

	return (
		<Container
			maxWidth="lg"
			sx={{ py: 4, px: isMobile ? 2 : 4 }}
		>
			<Box sx={{ mb: 4 }}>
				<Typography
					variant="h5"
					gutterBottom
				>
					{formData?.title || `Feedback Form`}
				</Typography>
				{error && (
					<Alert
						severity="error"
						sx={{ mt: 2 }}
					>
						{error}
					</Alert>
				)}
			</Box>

			<form onSubmit={handleSubmit}>
				<Grid
					container
					spacing={3}
				>
					{formData.questions.map((question) => (
						<Grid
							item
							xs={12}
							key={question._id}
						>
							<QuestionWrapper
								required={question.required}
								label={question.label}
							>
								{renderQuestion(question)}
							</QuestionWrapper>
						</Grid>
					))}
				</Grid>

				<Stack
					direction="row"
					spacing={2}
					justifyContent="flex-end"
					mt={6}
				>
					<Button
						onClick={onClose}
						disabled={submitting}
						variant="outlined"
						color="inherit"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={submitting}
						sx={{ minWidth: 140 }}
					>
						{submitting ? (
							<CircularProgress
								size={24}
								sx={{ color: "white" }}
							/>
						) : (
							"Submit Feedback"
						)}
					</Button>
				</Stack>
			</form>
		</Container>
	);
};

export default DynamicFeedbackForm;
