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
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../../store/slice/authSlice";
import { getToken } from "../../routes/apiConfig";

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

// Custom Hooks
const useFormFetcher = (entityType, entityId) => {
	const [formData, setFormData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchForm = async (formType) => {
		try {
			setLoading(true);
			const response = await axios.get(
				`http://localhost:3002/form/${entityType}/${entityId}?formType=${formType}`
			);

			console.log(response);
			// Check if form exists in response
			if (response.data?.success && response.data?.form) {
				console.log("Fetched form data:", response.data.form);
				setFormData(response.data.form);
				return {
					form: response.data.form,
					questions: response.data.form.questions || [],
				};
			} else {
				throw new Error(response.data?.message || "No form found");
			}
		} catch (err) {
			console.error("Error fetching form:", err);
			setError(err.message);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { formData, loading, error, fetchForm };
};

// Update the form submission hook
const useFormSubmission = () => {
	const [submitting, setSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [error, setError] = useState(null);

	const authUser = useSelector((store) => store.auth.user);

	const dispatch = useDispatch();
	const submitForm = async (
		formData,
		answers,
		entityType,
		entityId,
		userId
	) => {
		try {
			const token = getToken();
			console.log();
			setSubmitting(true);
			const res = await axios.post(
				`http://localhost:3002/form/submit`,
				{
					formId: formData._id,
					entityType, // Remove hardcoded "Event"
					entityId,
					userId,
					answers,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			// After successful registration
			if (res.data.success) {
				// Update user state based on entity type
				const stateKey =
					entityType === "Event"
						? "eventParticipated"
						: "opportunityParticipated";
				dispatch(
					setAuthUser({
						...authUser,
						[stateKey]: [...(authUser[stateKey] || []), entityId],
					})
				);

				setSubmitSuccess(true);
				toast.success("Registration submitted successfully!");
				return true;
			}
			return false;
		} catch (err) {
			console.error("Error loading form:", err); // Log error for debugging

			// Extract a meaningful error message
			const errorMessage =
				err.response?.data?.error || err.message || "Failed to load form";

			setError(errorMessage); // Set error state
			toast.error(errorMessage, { position: "top-right" }); // Show toast notification

			return null;
		} finally {
			setSubmitting(false);
		}
	};

	return { submitting, submitSuccess, error, submitForm };
};
const DynamicRegistrationForm = ({ entityType, entityId, onClose }) => {
	const { user } = useSelector((store) => store.auth);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const [answers, setAnswers] = useState({});
	const { formData, loading, error, fetchForm } = useFormFetcher(
		entityType,
		entityId
	);
	const { submitForm, submitting, submitSuccess } = useFormSubmission();

	useEffect(() => {
		const loadForm = async () => {
			const result = await fetchForm("REGISTRATION");
			if (result?.form?.questions) {
				// Initialize answers with empty values
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

		// Format answers for submission
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

		const success = await submitForm(
			formData,
			formattedAnswers,
			entityType,
			entityId,
			user?._id
		);

		if (success) {
			toast.success("Registration submitted successfully!");
			onClose?.();
		}
	};

	// Update the question rendering
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
	if (!formData) return <Alert severity="info">No form available</Alert>;

	const handleCancel = () => {
		if (submitting) {
			return; // Prevent canceling while submitting
		}
		onClose?.();
	};

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
					{formData?.title || `Registration Form`}
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
							{question.questionText}
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
						onClick={handleCancel}
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
							"Apply Now"
						)}
					</Button>
				</Stack>
			</form>
		</Container>
	);
};

export default DynamicRegistrationForm;
