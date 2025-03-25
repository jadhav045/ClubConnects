import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import FormLayout from "../common/FormComponent";

const AddFaculty = ({ onClose, collegeId }) => {
	// Fixed prop name typo
	const [formData, setFormData] = useState({
		fullName: "",
		prn: "",
		role: "Faculty",
		email: "",
		password: "",
		subRole: "",
	});

	console.log(collegeId);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			if (!token) throw new Error("No token found");

			const response = await axios.post(
				`http://localhost:3002/admin/create/faculty/${collegeId}`,
				formData,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			toast.success(response.data.message);
			onClose();
		} catch (error) {
			console.error("Error:", error.response?.data || error);
			toast.error(error.response?.data?.message || "Failed to create faculty");
		}
	};

	return (
		<div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white w-full max-w-xl rounded-xl shadow-2xl relative">
				{/* Header Section */}
				<div className="p-6 border-b border-gray-200 flex items-center justify-between">
					<h2 className="text-2xl font-bold text-gray-800">
						{" "}
						Vishwakarma Institute of Information Technology, Pune
					</h2>
					<button
						onClick={onClose}
						className="p-2 rounded-full hover:bg-gray-100 transition-colors"
						aria-label="Close"
					>
						<X className="w-6 h-6 text-gray-600" />
					</button>
				</div>

				{/* Form Section */}
				<div className="p-6">
					<FormLayout onSubmit={handleSubmit}>
						<div className="space-y-5">
							{/* Personal Info Group */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								<div className="space-y-1">
									<label className="block text-sm font-medium text-gray-700">
										Full Name <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="fullName"
										value={formData.fullName}
										onChange={handleChange}
										className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
										placeholder="John Doe"
										required
									/>
								</div>

								<div className="space-y-1">
									<label className="block text-sm font-medium text-gray-700">
										PRN <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="prn"
										value={formData.prn}
										onChange={handleChange}
										className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
										placeholder="Enter PRN"
										required
									/>
								</div>
							</div>

							{/* Account Info Group */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								<div className="space-y-1">
									<label className="block text-sm font-medium text-gray-700">
										Email <span className="text-red-500">*</span>
									</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
										placeholder="john@example.com"
										required
									/>
								</div>

								<div className="space-y-1">
									<label className="block text-sm font-medium text-gray-700">
										Password <span className="text-red-500">*</span>
									</label>
									<input
										type="password"
										name="password"
										value={formData.password}
										onChange={handleChange}
										className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
										placeholder="••••••••"
										required
									/>
								</div>
							</div>

							{/* Role Selection */}
							<div className="space-y-1">
								<label className="block text-sm font-medium text-gray-700">
									Faculty Role <span className="text-red-500">*</span>
								</label>
								<select
									name="subRole"
									value={formData.subRole}
									onChange={handleChange}
									className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-no-repeat"
								>
									<option
										value=""
										disabled
									>
										Select Role
									</option>
									<option value="Head of Department">Head of Department</option>
									<option value="Senior Faculty">Senior Faculty</option>
									<option value="Junior Faculty">Junior Faculty</option>
									<option value="Advisor">Advisor</option>
									<option value="Coordinator">Coordinator</option>
									<option value="Mentor">Mentor</option>
								</select>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							>
								Create Faculty Account
							</button>
						</div>
					</FormLayout>
				</div>
			</div>
		</div>
	);
};

export default AddFaculty;
