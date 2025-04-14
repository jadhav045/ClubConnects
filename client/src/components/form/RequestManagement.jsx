import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const RequestManagement = () => {
	const [requests, setRequests] = useState([]);
	const [formData, setFormData] = useState({
		clubId: "",
		submittedBy: "",
		title: "",
		description: "",
		submissionDate: new Date().toISOString(),
		requestType: "Event Approval",
		attachments: [
			{ fileName: "", fileUrl: "", uploadedAt: new Date().toISOString() },
		],
	});
	const [statusUpdate, setStatusUpdate] = useState({
		status: "",
		updatedBy: "",
	});

	useEffect(() => {
		fetchRequests();
	}, []);

	const fetchRequests = async () => {
		try {
			const response = await axios.get(
				"http://localhost:3002/faculty/request/all"
			);
			setRequests(response.data);
		} catch (error) {
			console.error("Error fetching requests:", error);
		}
	};

	const handleCreateRequest = async () => {
		try {
			const response = await axios.post(
				"http://localhost:3002/faculty/request/add",
				formData
			);
			toast.success("Request created successfully!");
			fetchRequests();
		} catch (error) {
			console.error("Error creating request:", error);
			toast.error(error.response?.data?.message || "Failed to create request");
		}
	};

	const handleAttachmentChange = (index, field, value) => {
		const updatedAttachments = [...formData.attachments];
		updatedAttachments[index][field] = value;
		setFormData({ ...formData, attachments: updatedAttachments });
	};

	const addAttachment = () => {
		setFormData({
			...formData,
			attachments: [
				...formData.attachments,
				{ fileName: "", fileUrl: "", uploadedAt: new Date().toISOString() },
			],
		});
	};
	// Update request status
	const updateRequestStatus = async (requestId, status, actionBy) => {
		try {
			const response = await axios.put(
				`http://localhost:3002/faculty/request/updatestatus/${requestId}`,
				{
					status,
					actionBy,
				}
			);
			alert(response.data.message);
			fetchRequests();
		} catch (error) {
			console.error("Error updating request status:", error);
		}
	};

	// Delete a request
	const deleteRequest = async (requestId) => {
		try {
			const response = await axios.delete(
				`http://localhost:3002/faculty/request/delete/${requestId}`
			);
			alert(response.data.message);
			fetchRequests();
		} catch (error) {
			console.error("Error deleting request:", error);
		}
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">Request Management</h1>
			<form className="bg-white p-6 rounded-lg shadow-md">
				<h2 className="text-2xl mb-4">Create Request</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<input
						className="p-2 border border-gray-300 rounded"
						placeholder="Club ID"
						onChange={(e) =>
							setFormData({ ...formData, clubId: e.target.value })
						}
					/>
					<input
						className="p-2 border border-gray-300 rounded"
						placeholder="Submitted By"
						onChange={(e) =>
							setFormData({ ...formData, submittedBy: e.target.value })
						}
					/>
				</div>
				<input
					className="p-2 mt-4 border border-gray-300 rounded w-full"
					placeholder="Title"
					onChange={(e) => setFormData({ ...formData, title: e.target.value })}
				/>
				<textarea
					className="p-2 mt-4 border border-gray-300 rounded w-full"
					placeholder="Description"
					onChange={(e) =>
						setFormData({ ...formData, description: e.target.value })
					}
				></textarea>

				<select
					className="p-2 mt-4 border border-gray-300 rounded w-full"
					onChange={(e) =>
						setFormData({ ...formData, requestType: e.target.value })
					}
				>
					<option value="Event Approval">Event Approval</option>
					<option value="Budget Request">Budget Request</option>
					<option value="Resource Request">Resource Request</option>
				</select>

				<h3 className="text-xl mt-6">Attachments</h3>
				{formData.attachments.map((attachment, index) => (
					<div
						key={index}
						className="grid grid-cols-2 gap-4 mt-4"
					>
						<input
							className="p-2 border border-gray-300 rounded"
							placeholder="File Name"
							onChange={(e) =>
								handleAttachmentChange(index, "fileName", e.target.value)
							}
						/>
						<input
							className="p-2 border border-gray-300 rounded"
							placeholder="File URL"
							onChange={(e) =>
								handleAttachmentChange(index, "fileUrl", e.target.value)
							}
						/>
					</div>
				))}
				<button
					type="button"
					className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
					onClick={addAttachment}
				>
					Add Attachment
				</button>

				<button
					type="button"
					className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
					onClick={handleCreateRequest}
				>
					Create Request
				</button>
			</form>

			<div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
				<h2 className="text-2xl font-bold mb-6 text-center">All Requests</h2>
				<ul className="space-y-6">
					{requests.map((req) => (
						<li
							key={req._id}
							className="p-6 bg-gray-50 border rounded-lg hover:shadow-md"
						>
							<h3 className="text-xl font-semibold mb-2">{req.title}</h3>
							<p className="text-gray-700 mb-4">{req.description}</p>
							<p className="text-sm mb-4">
								<strong>Status:</strong>{" "}
								<span className="text-indigo-600">{req.requestStatus}</span>
							</p>

							<div className="flex space-x-4">
								<button
									onClick={() =>
										updateRequestStatus(req._id, "Approved", "67c9f49d5563ae44383c1f33")
									}
									className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
								>
									Approve
								</button>
								<button
									onClick={() =>
										updateRequestStatus(req._id, "Rejected", "67c9f49d5563ae44383c1f33")
									}
									className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
								>
									Reject
								</button>
								<button
									onClick={() => deleteRequest(req._id)}
									className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
								>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default RequestManagement;
