import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AddFaculty from "./AddFaculty";
import FacultyList from "./FacultyList";
import AddCollege from "./AddCollege";
// import { User, X } from "lucide-react";
import {
	User,
	X,
	Building2,
	Plus,
	LineChart,
	Contact2,
	School,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../routes/apiConfig";

const CollegeList = () => {
	const user = getUser();
	const [colleges, setColleges] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCollegeId, setSelectedCollegeId] = useState(null);
	const [viewFacultyId, setViewFacultyId] = useState(null);
	const [showAddCollege, setShowAddCollege] = useState(false);
	const [selectedCollegeCode, setSelectedCollegeCode] = useState(null);
	const navigate = useNavigate();
	useEffect(() => {
		const fetchColleges = async () => {
			try {
				const token = localStorage.getItem("token");
				console.log("f");
				const response = await axios.get(
					"http://localhost:3002/admin/college/list",
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setColleges(response.data.data);
			} catch (error) {
				toast.error(
					error.response?.data?.message || "Failed to fetch colleges"
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
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<School className="w-8 h-8 text-white" />
						<h2 className="text-2xl font-semibold text-white">
							College Management
						</h2>
					</div>
					<button
						onClick={() => setShowAddCollege(true)}
						className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg flex items-center space-x-2 transition-all"
					>
						<Plus className="w-5 h-5" />
						<span>Add College</span>
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					{showAddCollege && (
						<AddCollege
							onClose={() => setShowAddCollege(false)}
							setColleges={setColleges}
						/>
					)}

					{loading ? (
						<div className="space-y-4">
							{[...Array(3)].map((_, i) => (
								<div
									key={i}
									className="animate-pulse bg-gray-100 rounded-lg p-4 h-20"
								/>
							))}
						</div>
					) : colleges.length === 0 ? (
						<div className="text-center py-12">
							<div className="mx-auto max-w-md">
								<Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900">
									No colleges found
								</h3>
								<p className="mt-1 text-gray-500">
									Get started by adding a new college
								</p>
							</div>
						</div>
					) : (
						<div className="border rounded-lg overflow-hidden shadow-sm">
							<div className="relative max-h-[600px] overflow-auto">
								<table className="w-full divide-y divide-gray-200">
									<thead className="bg-gray-50 sticky top-0 z-10">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
												College Code
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
												Name
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
												University
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
												Created By
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{colleges?.map((college) => (
											<tr
												key={college._id}
												className="hover:bg-gray-50 transition-colors"
											>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
														{college.collegeCode}
													</span>
												</td>
												<td className="px-6 py-4 font-medium text-gray-900">
													{college.name}
												</td>
												<td className="px-6 py-4 text-gray-500">
													{college.universityAffiliation}
												</td>
												<td className="px-6 py-4 text-gray-500">
													<div className="flex items-center space-x-2">
														<User className="w-4 h-4 text-gray-400" />
														<span>{college.adminDetails?.fullName}</span>
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="grid grid-cols-2 gap-3">
														<div className="col-span-2 flex gap-3">
															<button
																onClick={() =>
																	setSelectedCollegeId(college._id)
																}
																className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
															>
																<Plus className="w-4 h-4" />
																<span>Add Faculty</span>
															</button>
															<button
																onClick={() => {
																	setViewFacultyId(college._id);
																	setSelectedCollegeCode(college.collegeCode);
																}}
																className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
															>
																<Contact2 className="w-4 h-4" />
																<span>View Faculty</span>
															</button>
														</div>
														<div className="col-span-2 flex gap-3">
															<button
																onClick={() =>
																	navigate(
																		`/${user.role}/institute/${college._id}`
																	)
																}
																className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
															>
																<Building2 className="w-4 h-4" />
																<span>College Profile</span>
															</button>
															<button
																onClick={() =>
																	navigate(`/${user.role}/institute/analytics`)
																}
																className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
															>
																<LineChart className="w-4 h-4" />
																<span>Analytics</span>
															</button>
														</div>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>

				{/* Modals */}
				{selectedCollegeId && (
					<AddFaculty
						onClose={() => setSelectedCollegeId(null)}
						collegeId={selectedCollegeId}
					/>
				)}

				{viewFacultyId && (
					<div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
						<div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl">
							<div className="flex items-center justify-between p-6 border-b border-gray-200">
								<div className="flex items-center space-x-3">
									<Contact2 className="w-6 h-6 text-blue-600" />
									<h3 className="text-xl font-semibold">
										Faculty Members
										<span className="text-sm text-gray-500 ml-2 font-normal">
											({selectedCollegeCode})
										</span>
									</h3>
								</div>
								<button
									onClick={() => setViewFacultyId(null)}
									className="p-2 hover:bg-gray-100 rounded-full transition-colors"
								>
									<X className="w-6 h-6 text-gray-600" />
								</button>
							</div>
							<div className="p-6 max-h-[70vh] overflow-y-auto">
								<FacultyList collegeId={viewFacultyId} />
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CollegeList;
