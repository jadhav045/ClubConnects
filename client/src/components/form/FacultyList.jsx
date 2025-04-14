import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getUser } from "../../routes/apiConfig";
import { useNavigate } from "react-router-dom";
const FacultyList = ({ collegeId }) => {
	const [faculties, setFaculties] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFaculties = async () => {
			const token = localStorage.getItem("token");
			if (!token) throw new Error("No token found");

			console.log(collegeId);
			try {
				const response = await axios.get(
					`http://localhost:3002/admin/faculty/list/${collegeId}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setFaculties(response.data.data);
			} catch (error) {
				toast.error(
					error.response?.data?.message || "Failed to fetch faculty list"
				);
			} finally {
				setLoading(false);
			}
		};
		fetchFaculties();
	}, []);

	const navigate = useNavigate();
	const user = getUser();
	const handleNavigate = (userid) => {
		navigate(`/${user.role}/profile/${userid}`);
	};
	if (loading)
		return (
			<div className="flex flex-col items-center justify-center h-40 space-y-3">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
				<p className="text-gray-600 text-sm">Loading faculties...</p>
			</div>
		);
	return (
		<div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg">
			<div className="p-6">
				{faculties.length === 0 ? (
					<div className="text-center py-8 bg-gray-50 rounded-lg">
						<p className="text-gray-500">No faculty members found</p>
					</div>
				) : (
					<div className="space-y-4">
						{faculties.map((faculty) => (
							<div
								key={faculty._id}
								className="border rounded-lg shadow-sm hover:shadow-md transition-shadow"
							>
								{/* Faculty Header */}
								<div className="p-4 bg-gray-50 flex justify-between items-start">
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<div
												className="cursor-pointer flex items-center gap-2"
												onClick={() => handleNavigate(faculty._id)}
											>
												{/* Avatar */}
												<div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-white font-semibold text-xl overflow-hidden cursor-pointer">
													{faculty.profilePicture ? (
														<img
															src={faculty.profilePicture}
															alt={faculty.fullName}
															className="w-full h-full object-cover"
														/>
													) : (
														<span>
															{faculty.fullName.charAt(0).toUpperCase()}
														</span>
													)}
												</div>

												{/* Full Name (Vertically Centered) */}
												<h3 className="text-lg font-semibold text-gray-800">
													{faculty.fullName}
												</h3>
											</div>
											<span className="inline-block px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
												{faculty.profileId?.subRole || "Faculty"}
											</span>
										</div>

										<div className="mt-2 space-y-1">
											<p className="text-sm text-gray-600">
												<span className="font-medium">Email:</span>{" "}
												<a
													href={`mailto:${faculty.email}`}
													className="text-blue-600 hover:underline"
												>
													{faculty.email}
												</a>
											</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default FacultyList;
