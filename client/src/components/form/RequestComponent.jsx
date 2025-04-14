import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setRequests } from "../../store/slice/requestSlice";

const RequestComponent = () => {
	const { user } = useSelector((store) => store.auth);

	const presidentClub = user?.profileId?.clubsJoined?.find(
		(club) => club.role === "President"
	);
	const presidentClubId = presidentClub?.clubId;
	const [formData, setFormData] = useState({
		clubId: presidentClubId,
		requestType: "",
		title: "",
		description: "",
		justification: "",
		submittedBy: user?._id,
		attachments: [],
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFileChange = (e) => {
		setFormData({ ...formData, attachments: Array.from(e.target.files) });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const formDataToSend = new FormData();
			Object.keys(formData).forEach((key) => {
				if (key === "attachments") {
					formData.attachments.forEach((file) => {
						formDataToSend.append("attachments", file);
					});
				} else {
					formDataToSend.append(key, formData[key]);
				}
			});

			// console.log(formDataToSend);
			for (let pair of formDataToSend.entries()) {
				console.log(pair[0], pair[1]);
			}

			const response = await fetch(
				"http://localhost:3002/faculty/request/add",
				{
					method: "POST",
					body: formDataToSend,
				}
			);

			const result = await response.json();
			if (response.success) {
				toast.success(result.message);
				dispatch(setRequests([...requests, newRequest]));
				setFormData({
					clubId: presidentClubId,
					requestType: "",
					title: "",
					description: "",
					justification: "",
					submittedBy: user?._id,
					attachments: [],
				});
			} else {
				toast.error(result.message || "Failed to create request");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
			<h2 className="text-2xl font-semibold mb-4 text-center">
				Submit Request
			</h2>
			<form
				onSubmit={handleSubmit}
				className="space-y-4"
			>
				{/* <input
					type="text"
					name="clubId"
					placeholder="Club ID"
					value={formData.clubId}
					onChange={handleChange}
					required
					className="w-full p-2 border border-gray-300 rounded"
				/> */}
				<input
					type="text"
					name="requestType"
					placeholder="Request Type"
					value={formData.requestType}
					onChange={handleChange}
					required
					className="w-full p-2 border border-gray-300 rounded"
				/>
				<input
					type="text"
					name="title"
					placeholder="Title"
					value={formData.title}
					onChange={handleChange}
					required
					className="w-full p-2 border border-gray-300 rounded"
				/>
				<textarea
					name="description"
					placeholder="Description"
					value={formData.description}
					onChange={handleChange}
					required
					className="w-full p-2 border border-gray-300 rounded"
				/>
				<textarea
					name="justification"
					placeholder="Justification"
					value={formData.justification}
					onChange={handleChange}
					required
					className="w-full p-2 border border-gray-300 rounded"
				/>
				{/* <input
					type="text"
					name="submittedBy"
					placeholder="Submitted By"
					value={formData.submittedBy}
					onChange={handleChange}
					required
					className="w-full p-2 border border-gray-300 rounded"
				/> */}
				<input
					type="file"
					multiple
					onChange={handleFileChange}
					className="w-full p-2 border border-gray-300 rounded"
				/>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
				>
					{loading ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
};

export default RequestComponent;
