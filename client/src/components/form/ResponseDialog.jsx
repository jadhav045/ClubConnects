import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	CircularProgress,
	Alert,
} from "@mui/material";

const ResponseDialog = ({
	open,
	onClose,
	title,
	responses = [], // Ensure default empty array to avoid undefined issues
	loading,
	error,
}) => {
	// Extract questions from the first response if available
	const questions = responses.length > 0 ? responses[0].answers || [] : [];

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="xl"
		>
			<DialogTitle className="bg-indigo-500 text-white">{title}</DialogTitle>
			<DialogContent
				className="p-6"
				style={{ minHeight: "60vh" }}
			>
				{/* Loading State */}
				{loading && (
					<div className="text-center">
						<CircularProgress />
						<p>Loading responses...</p>
					</div>
				)}

				{/* Error State */}
				{error && (
					<Alert
						severity="error"
						className="mb-4"
					>
						{error}
					</Alert>
				)}

				{/* Handle No Responses */}
				{!loading && responses.length === 0 && (
					<p className="text-center text-gray-500 mt-4">No responses found</p>
				)}

				{/* Table Display Only If There Are Responses */}
				{responses.length > 0 && (
					<div className="overflow-x-auto">
						<table className="w-full text-sm border-collapse">
							<thead>
								<tr className="bg-gray-50">
									<th className="sticky left-0 z-10 p-4 text-left border-b border-gray-200 bg-gray-50">
										User Email
									</th>
									<th className="sticky left-40 z-10 p-4 text-left border-b border-gray-200 bg-gray-50">
										Submission Date
									</th>

									{/* Dynamically Render Question Headers */}
									{questions.map((question, index) => (
										<th
											key={index}
											className="p-4 text-left border-b border-gray-200 bg-gray-50"
										>
											<div className="flex items-center gap-2">
												<span
													className={`inline-block w-2 h-2 rounded-full 
                            ${
															question.questionType === "TEXT"
																? "bg-green-500"
																: question.questionType === "MULTIPLE_CHOICE"
																? "bg-blue-500"
																: "bg-purple-500"
														}`}
												/>
												{question.questionText || "Unnamed Question"}
											</div>
										</th>
									))}
								</tr>
							</thead>

							<tbody>
								{responses.map((response, index) => (
									<tr
										key={index}
										className={`hover:bg-gray-50 ${
											index % 2 === 0 ? "bg-white" : "bg-gray-50"
										}`}
									>
										<td className="sticky left-0 p-4 border-b border-gray-200 bg-white">
											{response?.user?.email || "Unknown"}
										</td>
										<td className="sticky left-40 p-4 border-b border-gray-200 bg-white">
											{response?.submittedAt
												? new Date(response.submittedAt).toLocaleDateString()
												: "N/A"}
										</td>

										{/* Dynamically Render Answers */}
										{response.answers && response.answers.length > 0 ? (
											response.answers.map((answer, idx) => (
												<td
													key={idx}
													className="p-4 border-b border-gray-200"
												>
													{Array.isArray(answer.answer)
														? answer.answer.join(", ")
														: answer.answer || "No response"}
												</td>
											))
										) : (
											<td
												colSpan={questions.length}
												className="p-4 text-center border-b border-gray-200"
											>
												No answers provided
											</td>
										)}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default ResponseDialog;
