import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import FormLayout from "../common/FormComponent";

const AddFaculty = ({ onClose, collegeId }) => {
	const [formData, setFormData] = useState({
		fullName: "",
		prn: "",
		role: "Faculty",
		email: "",
		password: "",
		subRole: "",
	});

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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
			<div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-lg">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
					<h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
						Vishwakarma Institute of Information Technology, Pune
					</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition"
						aria-label="Close"
					>
						<X className="w-6 h-6 text-gray-600" />
					</button>
				</div>

				{/* Form Body */}
				<div className="p-6">
					<FormLayout onSubmit={handleSubmit}>
						<div className="grid gap-6">
							{/* Name & PRN */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<InputField
									label="Full Name"
									name="fullName"
									type="text"
									placeholder="John Doe"
									value={formData.fullName}
									onChange={handleChange}
									required
								/>
								<InputField
									label="PRN"
									name="prn"
									type="text"
									placeholder="Enter PRN"
									value={formData.prn}
									onChange={handleChange}
									required
								/>
							</div>

							{/* Email & Password */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<InputField
									label="Email"
									name="email"
									type="email"
									placeholder="john@example.com"
									value={formData.email}
									onChange={handleChange}
									required
								/>
								<InputField
									label="Password"
									name="password"
									type="password"
									placeholder="••••••••"
									value={formData.password}
									onChange={handleChange}
									required
								/>
							</div>

							{/* Role Dropdown */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Faculty Role <span className="text-red-500">*</span>
								</label>
								<select
									name="subRole"
									value={formData.subRole}
									onChange={handleChange}
									required
									className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

							{/* Submit */}
							<button
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
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

// Reusable InputField component
const InputField = ({
	label,
	name,
	type,
	placeholder,
	value,
	onChange,
	required,
}) => (
	<div className="flex flex-col">
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label} {required && <span className="text-red-500">*</span>}
		</label>
		<input
			type={type}
			name={name}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			required={required}
			className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
		/>
	</div>
);

export default AddFaculty;
