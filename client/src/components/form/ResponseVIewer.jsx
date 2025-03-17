import React, { useState } from "react";
import axios from "axios";
import { Table, User, Calendar, FileText, AlertCircle } from "lucide-react";

const ResponseViewer = () => {
	// ... existing state and fetch logic ...

	const [eventId, setEventId] = useState("");
	const [formType, setFormType] = useState("REGISTRATION");
	const [responses, setResponses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Calculate statistics
	const totalResponses = responses.length;
	const lastSubmission = responses[0]
		? new Date(responses[0].submittedAt).toLocaleDateString()
		: "N/A";

	// Get unique questions from the first response (assuming consistent questions)
	const columns =
		responses[0]?.answers.map((answer) => ({
			question: answer.questionText,
			type: answer.questionType,
		})) || [];

	return (
		<div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
			{/* Search/Filter Section (keep your existing code) */}

			{/* Excel-style Table */}
			<div className="border rounded-lg shadow-sm overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="bg-gray-50">
						<tr>
							{/* User Info Columns */}
							<th className="sticky left-0 z-10 bg-gray-50 p-4 text-left border-r">
								<div className="flex items-center gap-2">
									<User className="w-4 h-4" />
									User Email
								</div>
							</th>
							<th className="sticky left-[200px] z-10 bg-gray-50 p-4 text-left border-r">
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4" />
									Submission Date
								</div>
							</th>

							{/* Dynamic Question Columns */}
							{columns.map((col, index) => (
								<th
									key={index}
									className="p-4 text-left border-l"
								>
									<div className="flex items-center gap-2">
										<span
											className={`inline-block w-2 h-2 rounded-full 
                                            ${
																							col.type === "TEXT"
																								? "bg-green-500"
																								: col.type === "MULTIPLE_CHOICE"
																								? "bg-blue-500"
																								: "bg-purple-500"
																						}`}
										/>
										{col.question}
									</div>
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{responses.map((response, rowIndex) => (
							<tr
								key={rowIndex}
								className="hover:bg-gray-50 border-t"
							>
								{/* User Info Cells */}
								<td className="sticky left-0 bg-white p-4 border-r">
									{response.user.email}
								</td>
								<td className="sticky left-[200px] bg-white p-4 border-r">
									{new Date(response.submittedAt).toLocaleDateString()}
								</td>

								{/* Answer Cells */}
								{response.answers.map((answer, colIndex) => (
									<td
										key={colIndex}
										className="p-4 border-l"
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
					<div className="p-8 text-center text-gray-500">
						<FileText className="mx-auto mb-2" />
						No responses found
					</div>
				)}
			</div>
		</div>
	);
};

export default ResponseViewer;
