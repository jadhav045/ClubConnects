import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import FormLayout from "../common/FormComponent";

const AddCollege = ({ onClose, setColleges }) => {
	const [collegeData, setCollegeData] = useState({
		name: "",
		collegeCode: "",
		universityAffiliation: "",
		address: "",
		contactInfo: "",
		establishedYear: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCollegeData({ ...collegeData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			if (!token) throw new Error("No token found");

			const response = await axios.post(
				"http://localhost:3002/admin/create/college",
				collegeData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.success) {
				setColleges((prev) => [...prev, response.data.newCollege]); // ✅ Fix
				toast.success("College created successfully");
				onClose(); // close the modal
			}
		} catch (error) {
			console.error("Error:", error.response?.data || error);
			toast.error(error.response?.data.message || "Failed to create college");
		}
	};

	return (
		<div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl relative mx-2">
				{/* Header Section */}
				<div className="p-6 border-b border-gray-200 flex items-center justify-between">
					<h2 className="text-2xl font-bold text-gray-800">Add New College</h2>
					<button
						onClick={onClose}
						className="p-1 rounded-full hover:bg-gray-100 transition-colors"
						aria-label="Close"
					>
						<X className="w-6 h-6 text-gray-600" />
					</button>
				</div>

				{/* Form Section */}
				<div className="p-6 space-y-6">
					<FormLayout onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* College Information Group */}
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										College Name <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="name"
										value={collegeData.name}
										onChange={handleChange}
										className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
										placeholder="Enter college name"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										College Code <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="collegeCode"
										value={collegeData.collegeCode}
										onChange={handleChange}
										className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
										placeholder="Enter unique code"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Established Year <span className="text-red-500">*</span>
									</label>
									<input
										type="number"
										name="establishedYear"
										value={collegeData.establishedYear}
										onChange={handleChange}
										className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
										placeholder="e.g., 1990"
										min="1900"
										max={new Date().getFullYear()}
										required
									/>
								</div>
							</div>

							{/* Contact Information Group */}
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										University Affiliation{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="universityAffiliation"
										value={collegeData.universityAffiliation}
										onChange={handleChange}
										className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
										placeholder="Affiliated university"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Contact Information <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="contactInfo"
										value={collegeData.contactInfo}
										onChange={handleChange}
										className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
										placeholder="Phone number or email"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Full Address <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="address"
										value={collegeData.address}
										onChange={handleChange}
										className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
										placeholder="Street, City, State"
										required
									/>
								</div>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Create College
						</button>
					</FormLayout>
				</div>
			</div>
		</div>
	);
};

export default AddCollege;
