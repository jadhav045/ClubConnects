// Create a new component ResponseDialog.jsx
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
	responses,
	loading,
	error,
	entityId,
	entityType,
	formType,
}) => {
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
				{loading && (
					<div className="text-center">
						<CircularProgress />
						<p>Loading responses...</p>
					</div>
				)}

				{error && (
					<Alert
						severity="error"
						className="mb-4"
					>
						{error}
					</Alert>
				)}

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

								{responses[0]?.answers.map((question, index) => (
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
											{question.questionText}
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
										{response.user.email}
									</td>
									<td className="sticky left-40 p-4 border-b border-gray-200 bg-white">
										{new Date(response.submittedAt).toLocaleDateString()}
									</td>

									{response.answers.map((answer, index) => (
										<td
											key={index}
											className="p-4 border-b border-gray-200"
										>
											{Array.isArray(answer.answer)
												? answer.answer.join(", ")
												: answer.answer}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>

					{!loading && responses.length === 0 && (
						<p className="text-center text-gray-500 mt-4">No responses found</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ResponseDialog;
