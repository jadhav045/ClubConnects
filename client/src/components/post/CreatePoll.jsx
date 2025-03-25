import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChartBarIcon, PlusIcon, XIcon } from "lucide-react";

const initialPollOptions = [
	{ id: 1, text: "" },
	{ id: 2, text: "" },
];

const CreatePoll = ({ onSubmit }) => {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState(initialPollOptions);
	const [endDate, setEndDate] = useState("");
	const [description, setDescription] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleAddOption = () => {
		if (options.length < 6) {
			setOptions([...options, { id: Date.now(), text: "" }]);
		} else {
			toast.warning("Maximum 6 options allowed");
		}
	};

	const handleRemoveOption = (id) => {
		if (options.length > 2) {
			setOptions(options.filter((option) => option.id !== id));
		} else {
			toast.warning("Minimum 2 options required");
		}
	};

	const handleOptionChange = (id, value) => {
		setOptions(
			options.map((option) =>
				option.id === id ? { ...option, text: value } : option
			)
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation
		if (!question.trim()) {
			toast.error("Please enter a question");
			return;
		}

		if (options.some((option) => !option.text.trim())) {
			toast.error("Please fill all options");
			return;
		}

		if (!endDate) {
			toast.error("Please set an end date");
			return;
		}

		const pollData = {
			pollQuestion: question.trim(),
			text: description.trim(),
			pollOptions: options.map((opt) => ({
				optionText: opt.text.trim(),
			})),
			endDate: new Date(endDate).toISOString(),
			allowMultipleVotes: false, // Add UI control if needed
			isPublic: true, // Add UI control if needed
		};

		try {
			setIsSubmitting(true);
			const token = localStorage.getItem("token");
			if (!token) throw new Error("No token found");

			const res = await axios.post(
				"http://localhost:3002/post/poll", // Update endpoint
				pollData,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (onSubmit) onSubmit(res.data);
			toast.success("Poll created successfully!");

			// Reset form
			setQuestion("");
			setDescription("");
			setOptions(initialPollOptions);
			setEndDate("");
		} catch (error) {
			console.error("Error creating poll:", error);
			toast.error(error.response?.data?.message || "Failed to create poll");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl border border-gray-100 p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<div className="p-2 bg-purple-100 rounded-lg">
					<ChartBarIcon className="w-6 h-6 text-purple-600" />
				</div>
				<h2 className="text-2xl font-bold text-gray-900">Create New Poll</h2>
			</div>

			{/* Poll Form */}
			<div className="space-y-6">
				{/* Question Input */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">
						Poll Question
					</label>
					<textarea
						className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
						placeholder="Ask your question here..."
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						rows={2}
					/>
				</div>

				{/* Description */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">
						Description (Optional)
					</label>
					<textarea
						className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
						placeholder="Add more context to your poll..."
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={3}
					/>
				</div>

				{/* Options */}
				<div className="space-y-3">
					<label className="text-sm font-medium text-gray-700">
						Poll Options
					</label>
					{options.map((option, index) => (
						<div
							key={option.id}
							className="flex gap-2"
						>
							<input
								type="text"
								className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
								placeholder={`Option ${index + 1}`}
								value={option.text}
								onChange={(e) => handleOptionChange(option.id, e.target.value)}
							/>
							{options.length > 2 && (
								<button
									onClick={() => handleRemoveOption(option.id)}
									className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
								>
									<XIcon className="w-5 h-5" />
								</button>
							)}
						</div>
					))}
					{options.length < 6 && (
						<button
							onClick={handleAddOption}
							className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
						>
							<PlusIcon className="w-5 h-5" />
							Add Option
						</button>
					)}
				</div>

				{/* End Date */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">
						Poll End Date
					</label>
					<input
						type="datetime-local"
						className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						min={new Date().toISOString().slice(0, 16)}
					/>
				</div>

				{/* Submit Button */}
				<button
					onClick={handleSubmit}
					disabled={isSubmitting}
					className={`w-full py-3.5 rounded-xl text-white font-medium transition-all ${
						isSubmitting
							? "bg-gray-400 cursor-not-allowed"
							: "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg hover:shadow-purple-200"
					}`}
				>
					{isSubmitting ? "Creating Poll..." : "Create Poll"}
				</button>
			</div>
		</div>
	);
};

export default CreatePoll;
