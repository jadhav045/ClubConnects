import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CollegeList = () => {
	const [colleges, setColleges] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchColleges = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) throw new Error("No token found");

				const response = await axios.get(
					"http://localhost:3002/admin/college/list",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setColleges(response.data.data);
			} catch (error) {
				console.error("Error fetching college list:", error);
				toast.error(
					error.response?.data?.message ||
						"Failed to fetch college list. Please try again."
				);
			} finally {
				setLoading(false);
			}
		};
		fetchColleges();
	}, []);

	if (loading)
		return (
			<div className="flex justify-center items-center h-40">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
			</div>
		);

	return (
		<div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
			<h2 className="text-xl font-semibold mb-4 text-gray-700">College List</h2>

			{colleges.length === 0 ? (
				<div className="text-center text-gray-500 py-6">
					<p>No colleges found.</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full border-collapse border border-gray-300 rounded-lg">
						<thead className="bg-blue-500 text-white">
							<tr>
								<th className="py-2 px-4 text-left">College Name</th>
								<th className="py-2 px-4 text-left">Admin Full Name</th>
								<th className="py-2 px-4 text-left">Admin Email</th>
							</tr>
						</thead>
						<tbody>
							{colleges.map((college) => (
								<tr
									key={college._id}
									className="border-b border-gray-200 hover:bg-gray-100 transition"
								>
									<td className="py-2 px-4">{college.name}</td>
									<td className="py-2 px-4">
										{college.adminDetails?.createdBy?.fullName || "N/A"}
									</td>
									<td className="py-2 px-4">
										{college.adminDetails?.createdBy?.email || "N/A"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default CollegeList;
