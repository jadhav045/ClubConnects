import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

// Initial form state

// Form handler hooks
export const useFormHandlers = (entityId, entityType) => {
	const { user } = useSelector((store) => store.auth);
	const [formData, setFormData] = useState({
		entityType: entityType,
		entityId: entityId,
		formType: "",
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
			console.log(formData);
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

	return {
		formData,
		setFormData,
		addQuestion,
		handleQuestionChange,
		handleSubmit,
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
