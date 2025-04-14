import React, { useState } from "react";
import axios from "axios";
import { API_URL, getToken } from "../../../routes/apiConfig";

const MentorStatus = () => {
	const [status, setStatus] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleToggle = async () => {
		try {
			setLoading(true);
			setMessage("");

			const token = getToken();
			const res = await axios.put(
				`${API_URL}/student/availability`,
				{ status: !status }, // toggle status
				{
					headers: {
						Authorization: `Bearer ${token}`, // optional if cookie is used for token
						"Content-Type": "application/json",
					},
					withCredentials: true, // send cookies too (for authMiddleware)
				}
			);

			setStatus((prev) => !prev); // update UI status
			setMessage(res.data.message || "Status updated!");
		} catch (error) {
			console.error("Error:", error);
			setMessage(error?.response?.data?.message || "Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-4 max-w-sm mx-auto border rounded-lg shadow-md">
			<h2 className="text-lg font-semibold mb-2">Mentorship Availability</h2>
			<p className="mb-4">Status: {status ? "Available" : "Unavailable"}</p>
			<button
				onClick={handleToggle}
				disabled={loading}
				className={`px-4 py-2 rounded ${
					status ? "bg-red-500" : "bg-green-500"
				} text-white hover:opacity-90 transition`}
			>
				{loading ? "Updating..." : status ? "Set Unavailable" : "Set Available"}
			</button>
			{message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
		</div>
	);
};

export default MentorStatus;
