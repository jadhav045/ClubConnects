import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AddFaculty from "./AddFaculty";
import FacultyList from "./FacultyList";
import AddCollege from "./AddCollege";
import { X } from "lucide-react";

const CollegeList = () => {
	const [colleges, setColleges] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCollegeId, setSelectedCollegeId] = useState(null);
	const [viewFacultyId, setViewFacultyId] = useState(null);
	const [showAddCollege, setShowAddCollege] = useState(false);

	const [selectedCollegeCode, setSelectedCollegeCode] = useState(null);
	useEffect(() => {
		const fetchColleges = async () => {
			try {
				const token = localStorage.getItem("token");
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
		<div className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-800">College Directory</h2>
				<button
					onClick={() => setShowAddCollege(true)}
					className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
				>
					Add New College
				</button>
			</div>

			{/* Modals */}
			{showAddCollege && (
				<AddCollege onClose={() => setShowAddCollege(false)} />
			)}
			{selectedCollegeId && (
				<AddFaculty
					onClose={() => setSelectedCollegeId(null)}
					collegeId={selectedCollegeId}
				/>
			)}
			{viewFacultyId && (
				<div className="fixed inset-0 z-50  bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
					<div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl relative max-h-[90vh] overflow-hidden">
						{/* Modal Header */}
						<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
							<h3 className="text-xl font-semibold text-gray-800">
								Faculty Members
								<span className="text-sm text-gray-500 ml-2 font-normal">
									(College CODE: {selectedCollegeCode})
								</span>
							</h3>
							<button
								onClick={() => setViewFacultyId(null)}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
								aria-label="Close"
							>
								<X className="w-6 h-6 text-gray-600" />
							</button>
						</div>

						{/* Modal Content */}
						<div className="p-6 overflow-y-auto">
							<FacultyList
								onClose={() => setViewFacultyId(null)}
								collegeId={viewFacultyId}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Colleges Table */}
			{/* Colleges List */}
			{colleges.length === 0 ? (
				<div className="text-center text-gray-500 py-6">
					<p>No colleges found.</p>
				</div>
			) : (
				<div className="space-y-4">
					{colleges.map((college) => (
						<div
							key={college._id}
							className="border rounded-lg shadow-sm hover:shadow-md transition-shadow"
						>
							{/* College Header */}
							<div className="p-4 bg-gray-50 flex justify-between items-start">
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
										{college.name}
										<span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
											{college.collegeCode}
										</span>
									</h3>
									<div className="mt-2 space-y-1">
										<p className="text-sm text-gray-600">
											<span className="font-medium">
												University Affiliation:
											</span>{" "}
											{college.universityAffiliation}
										</p>
										<p className="text-sm text-gray-600">
											<span className="font-medium">Created By:</span>{" "}
											{college.adminDetails?.createdBy?.fullName}
											<span className="ml-2 text-gray-500">
												({college.adminDetails?.createdBy?.email})
											</span>
										</p>
									</div>
								</div>
								<div className="flex flex-col gap-2 ml-4">
									<button
										onClick={() => setSelectedCollegeId(college._id)}
										className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm whitespace-nowrap"
									>
										Add Faculty
									</button>
									<button
										onClick={() => {
											setViewFacultyId(college._id);
											setSelectedCollegeCode(college.collegeCode);
										}}
										className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm whitespace-nowrap"
									>
										View Faculty
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CollegeList;
