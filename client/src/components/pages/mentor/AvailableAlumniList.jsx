import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, getToken } from "../../../routes/apiConfig";

const AvailableAlumniList = () => {
	const [alumniList, setAlumniList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const fetchAlumni = async () => {
			try {
				const token = getToken();
				const res = await axios.get(
					`${API_URL}/auth/alumni`,

					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				); // Adjust endpoint as per your backend route
				setAlumniList(res.data);
			} catch (error) {
				console.error("Error fetching alumni:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAlumni();
	}, []);

	const handleSendRequest = async (alumniId) => {
		try {
			const token = getToken();
			const res = await axios.post(
				`${API_URL}/student/mentorship/request`,
				{ alumniId },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setMessage(res.data.message || "Request sent!");
		} catch (error) {
			console.error("Error sending request:", error);
			setMessage(error.response?.data?.message || "Failed to send request.");
		}
	};

	if (loading) return <div className="p-4">Loading alumni...</div>;

	return (
		<div className="p-6 max-w-3xl mx-auto">
			<h2 className="text-xl font-semibold mb-4">Available Alumni</h2>
			{message && <div className="mb-4 text-green-600">{message}</div>}
			{alumniList.length === 0 ? (
				<p>No alumni found.</p>
			) : (
				<ul className="space-y-4">
					{alumniList.map((alumni) => (
						<li
							key={alumni._id}
							className="border p-4 rounded-lg shadow flex justify-between items-center"
						>
							<div>
								<p className="font-medium">{alumni.name}</p>
								<p className="text-sm text-gray-600">{alumni.email}</p>
								<p
									className={`text-sm mt-1 ${
										alumni.availableForMentorship
											? "text-green-600"
											: "text-red-600"
									}`}
								>
									{alumni.availableForMentorship
										? "Available for Mentorship"
										: "Not Available"}
								</p>
							</div>
							{alumni.availableForMentorship && (
								<button
									onClick={() => handleSendRequest(alumni._id)}
									className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
								>
									Send Request
								</button>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default AvailableAlumniList;
