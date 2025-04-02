import { useCallback, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

// Initial form state

// Form handler hooks
export const useFormHandlers = (entityId, entityType, formType) => {
	const { user } = useSelector((store) => store.auth);

	const [formData, setFormData] = useState({
		entityType: entityType,
		entityId: entityId,
		formType: formType,
		title: "",
		questions: [],
		createdBy: user._id,
		creatorType: "User",
	});

	const addQuestion = () => {
		setFormData((prev) => ({
			...prev,
			questions: [
				...prev.questions,
				{
					questionType: "TEXT",
					questionText: "",
					options: [],
					required: false,
					order: prev.questions.length,
				},
			],
		}));
	};

	const handleQuestionChange = (index, field, value) => {
		const updatedQuestions = [...formData.questions];
		updatedQuestions[index][field] = value;
		setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			console.log("FOm", formData.entityType);
			const response = await axios.post(
				"http://localhost:3002/form/create",
				formData
			);
			alert("Form created successfully!");
			setFormData({
				entityType: entityType,
				entityId: entityId,
				formType: "",
				title: "",
				questions: [],
				createdBy: user._id,
				creatorType: "User",
			});
		} catch (error) {
			alert(error.response?.data?.error || "Error creating form");
		}
	};

	const removeQuestion = useCallback((indexToRemove) => {
		setFormData((prevData) => ({
			...prevData,
			questions: prevData.questions.filter(
				(_, index) => index !== indexToRemove
			),
		}));

		// Show confirmation toast
		toast.success("Question removed successfully");
	}, []);
	return {
		formData,
		setFormData,
		addQuestion,
		handleQuestionChange,
		handleSubmit,
		removeQuestion,
	};
};

// Question type options
export const questionTypes = [
	{ value: "TEXT", label: "Text" },
	{ value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
	{ value: "CHECKBOX", label: "Checkbox" },
	{ value: "DROPDOWN", label: "Dropdown" },
	{ value: "RATING", label: "Rating" },
];
