import { useState } from "react";
import axios from "axios";

export const useFormFetcher = (entityType, entityId) => {
	const [formData, setFormData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const fetchForm = async (formType) => {
		try {
			setLoading(true);
			setError("");
			const response = await axios.get(
				`http://localhost:3002/form/${entityType}/${entityId}?formType=${formType}`
			);

			if (response.data.form) {
				const form = response.data.form;
				const initialAnswers = form.questions.map((question) => ({
					questionId: question._id,
					value: Array.isArray(question.options) ? [] : "",
				}));
				return { form, initialAnswers };
			}
			throw new Error(`No ${formType} form found`);
		} catch (err) {
			setError(err.response?.data?.error || err.message);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { formData, setFormData, loading, error, fetchForm };
};

export const useFormSubmission = () => {
	const [submitting, setSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [error, setError] = useState("");

	const submitForm = async (
		formData,
		answers,
		entityType,
		entityId,
		userId
	) => {
		try {
			setSubmitting(true);
			setError("");

			const response = await axios.post("http://localhost:3002/form/submit", {
				formId: formData._id,
				entityType,
				entityId,
				userId,
				answers: answers.map((answer) => ({
					questionId: answer.questionId,
					value: answer.value,
				})),
			});

			setSubmitSuccess(true);
			setTimeout(() => setSubmitSuccess(false), 3000);
			return response;
		} catch (err) {
			setError(err.response?.data?.error || "Submission failed");
			throw err;
		} finally {
			setSubmitting(false);
		}
	};

	return { submitting, submitSuccess, error, submitForm };
};
