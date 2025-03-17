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
import { useSelector } from "react-redux";

const QuestionWrapper = ({ children, required, label }) => (
	<FormControl
		fullWidth
		margin="normal"
		required={required}
		component="fieldset"
	>
		<FormLabel component="legend">{label}</FormLabel>
		{children}
	</FormControl>
);

// Question Components
const TextQuestion = ({ value, onChange, required }) => (
	<TextField
		fullWidth
		value={value}
		onChange={(e) => onChange(e.target.value)}
		variant="outlined"
		required={required}
	/>
);

const MultipleChoiceQuestion = ({ value, onChange, options }) => (
	<RadioGroup
		value={value}
		onChange={(e) => onChange(e.target.value)}
	>
		{options.map((option) => (
			<FormControlLabel
				key={option}
				value={option}
				control={<Radio />}
				label={option}
			/>
		))}
	</RadioGroup>
);

const CheckboxQuestion = ({ value = [], onChange, options }) => (
	<Stack>
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
					/>
				}
				label={option}
			/>
		))}
	</Stack>
);

const DropdownQuestion = ({ value, onChange, options }) => (
	<Select
		fullWidth
		value={value}
		onChange={(e) => onChange(e.target.value)}
		displayEmpty
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

const RatingQuestion = ({ value, onChange }) => (
	<MuiRating
		precision={0.5}
		value={Number(value)}
		onChange={(_, newValue) => onChange(newValue)}
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
			console.log(entityId);
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
			const errorMessage = err.response?.data?.message || "Failed to load form";
			setError(errorMessage);
			toast.error(errorMessage, { position: "top-right" }); // Display error notification
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

	const submitForm = async (
		formData,
		answers,
		entityType,
		entityId,
		userId
	) => {
		try {
			console.log(userId || "no");
			setSubmitting(true);
			const res = await axios.post(`http://localhost:3002/form/submit`, {
				formId: formData._id,
				entityType: "Event",
				entityId,
				userId,
				answers,
			});
			console.log(res.data);
			console.log();
			setSubmitSuccess(true);
			setError(null);
			toast.success("Form submitted successfully!", { position: "top-right" }); // ✅ Success Toast
			return true;
		} catch (err) {
			const errorMessage = err.response?.data?.message || "Submission failed";
			setError(errorMessage);
			toast.error(errorMessage, { position: "top-right" }); // ❌ Error Toast
			return false;
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
			maxWidth="md"
			sx={{ py: 4 }}
		>
			<Box
				display="flex"
				justifyContent="flex-end"
				mb={2}
			>
				<Button
					variant="outlined"
					onClick={onClose}
					disabled={submitting}
				>
					Close
				</Button>
			</Box>

			{loading && (
				<CircularProgress sx={{ display: "block", margin: "20px auto" }} />
			)}

			<Box mt={2}>
				{error && (
					<Alert
						severity="error"
						sx={{ mb: 2 }}
					>
						{error}
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

			{formData && !loading && (
				<form onSubmit={handleSubmit}>
					<Typography
						variant="h4"
						gutterBottom
						sx={{ mb: 4 }}
					>
						{formData.title}
					</Typography>

					{formData.questions?.map((question) => (
						<QuestionWrapper
							key={question._id}
							required={question.required}
							label={question.questionText}
						>
							{renderQuestion(question)}
						</QuestionWrapper>
					))}

					<Stack
						direction="row"
						spacing={2}
						justifyContent="flex-end"
						mt={4}
					>
						<Button
							type="submit"
							variant="contained"
							size="large"
							disabled={submitting}
							sx={{ minWidth: 120 }}
						>
							{submitting ? <CircularProgress size={24} /> : "Submit"}
						</Button>
					</Stack>
				</form>
			)}
		</Container>
	);
};

export default DynamicRegistrationForm;
