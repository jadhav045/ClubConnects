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
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../../store/slice/authSlice";

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
	const { user } = useSelector((state) => state.auth);
	const [formData, setFormData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchForm = async (formType) => {
		try {
			const response = await axios.get(
				`http://localhost:3002/form/${entityType}/${entityId}?formType=${formType}`,
				{
					params: { type: formType },
				}
			);

			setFormData(response.data.form);
			return {
				form: response.data.form,
				initialAnswers: response.data.answers,
			};
		} catch (err) {
			console.error("Error loading form:", err); // Log error for debugging

			// Extract a meaningful error message
			const errorMessage =
				err.response?.data?.error || err.message || "Failed to load form";

			setError(errorMessage); // Set error state
			toast.error(errorMessage, { position: "top-right" }); // Show toast notification

			return null;
		} finally {
			setLoading(false);
		}
	};

	return { formData, setFormData, loading, error, fetchForm };
};

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
			setSubmitting(true);
			const res = await axios.post(`http://localhost:3002/form/submit`, {
				formId: formData._id,
				entityType: "Event",
				entityId,
				userId,
				answers,
			});

			// After successful registration
			if (res.data.success) {
				dispatch(
					setAuthUser({
						...authUser, // Spread existing user data
						eventParticipated: [
							...(authUser.eventParticipated || []),
							entityId,
						],
					})
				);
			}

			// console.log(res.data);
			setSubmitSuccess(true);
			setError(null);
			toast.success("Form submitted successfully!", { position: "top-right" }); // ✅ Success Toast
			return true;
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
	const { formData, setFormData, loading, error, fetchForm } = useFormFetcher(
		entityType,
		entityId
	);
	const {
		submitting,
		submitSuccess,
		error: submitError,
		submitForm,
	} = useFormSubmission();
	const [answers, setAnswers] = useState([]);

	useEffect(() => {
		const loadForm = async () => {
			const result = await fetchForm("REGISTRATION");
			if (result) {
				setFormData(result.form);
				// Initialize with question IDs and proper initial values
				setAnswers(
					result.form.questions.map((question) => ({
						questionId: question._id,
						value:
							result.initialAnswers?.find((a) => a.questionId === question._id)
								?.value || (question.questionType === "CHECKBOX" ? [] : ""),
					}))
				);
			}
		};
		loadForm();
	}, [entityType, entityId]);

	const handleAnswerChange = (questionId, value) => {
		setAnswers((prev) =>
			prev.map((answer) =>
				answer.questionId === questionId
					? { ...answer, value: Array.isArray(value) ? [...value] : value }
					: answer
			)
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Validate required questions
		const hasEmptyRequired = formData.questions.some(
			(q, i) => q.required && !answers[i]?.value?.toString().trim()
		);

		if (hasEmptyRequired) {
			setError("Please fill all required fields");
			return;
		}

		// Submit with proper structure
		const success = await submitForm(
			formData,
			answers, // Now includes questionId/value pairs
			entityType,
			entityId,
			user._id
		);

		if (success && onClose) setTimeout(onClose, 2000);
	};

	const renderQuestion = (question, index) => {
		const currentAnswer =
			answers.find((a) => a.questionId === question._id)?.value ?? "";

		const props = {
			value: currentAnswer,
			onChange: (value) => handleAnswerChange(question._id, value),
			options: question.options || [],
			required: question.required,
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

	return (
		<Container
			maxWidth="lg"
			sx={{ py: 4, px: isMobile ? 2 : 4 }}
		>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={4}
			>
				<Typography
					variant="h4"
					component="h1"
					sx={{ fontWeight: 700 }}
				>
					{formData?.title || "Registration Form"}
				</Typography>
				<Button
					variant="outlined"
					onClick={onClose}
					disabled={submitting}
					sx={{ minWidth: 100 }}
				>
					Close
				</Button>
			</Box>

			<Box mb={4}>
				{fetchError && (
					<Alert
						severity="error"
						sx={{ mb: 2 }}
					>
						{fetchError}
					</Alert>
				)}
				{submitError && (
					<Alert
						severity="error"
						sx={{ mb: 2 }}
					>
						{submitError}
					</Alert>
				)}
				{submitSuccess && (
					<Alert
						severity="success"
						sx={{ mb: 2 }}
					>
						Registration submitted successfully!
					</Alert>
				)}
			</Box>

			{formData && (
				<form onSubmit={handleSubmit}>
					<Grid
						container
						spacing={3}
					>
						{questionComponents}
					</Grid>

					<Stack
						direction="row"
						spacing={2}
						justifyContent="flex-end"
						mt={6}
						sx={{ px: isMobile ? 0 : 2 }}
					>
						<Button
							type="submit"
							variant="contained"
							size="large"
							disabled={submitting}
							sx={{
								minWidth: 140,
								py: 1.5,
								fontWeight: 600,
								textTransform: "none",
							}}
						>
							{submitting ? (
								<CircularProgress
									size={24}
									sx={{ color: "white" }}
								/>
							) : (
								"Submit Registration"
							)}
						</Button>
					</Stack>
				</form>
			)}
		</Container>
	);
};

export default DynamicRegistrationForm;
