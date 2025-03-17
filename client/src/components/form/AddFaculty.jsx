import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import FormLayout from "../common/FormComponent";

const AddFaculty = ({ onClose }) => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		fullName: "",
		prn: "",
		role: "Faculty",
		email: "",
		password: "",
		subRole: "",
	});

	const collegeId = "67c9f4165563ae44383c1f27";

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
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			toast.success(response.data.message);
			onClose(); // Close modal after success
			// navigate("/");
		} catch (error) {
			console.error("Error:", error.response?.data || error);
			toast.error(error.response?.data.message || "Failed to create faculty");
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white max-w-md w-full p-6 rounded-lg shadow-lg relative">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
				>
					<X size={24} />
				</button>

				<h2 className="text-xl font-bold mb-4">Add Faculty</h2>

				<FormLayout
					title="Add Faculty"
					onSubmit={handleSubmit}
				>
					<input
						type="text"
						name="fullName"
						placeholder="Full Name"
						value={formData.fullName}
						onChange={handleChange}
						className="input-field"
						required
					/>
					<input
						type="text"
						name="prn"
						placeholder="PRN"
						value={formData.prn}
						onChange={handleChange}
						className="input-field"
						required
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={formData.email}
						onChange={handleChange}
						className="input-field"
						required
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						value={formData.password}
						onChange={handleChange}
						className="input-field"
						required
					/>
					<select
						name="subRole"
						value={formData.subRole}
						onChange={handleChange}
						className="input-field"
					>
						<option value="Head of Department">Head of Department</option>
						<option value="Senior Faculty">Senior Faculty</option>
						<option value="Junior Faculty">Junior Faculty</option>
						<option value="Advisor">Advisor</option>
						<option value="Coordinator">Coordinator</option>
						<option value="Mentor">Mentor</option>
					</select>

					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
					>
						Add Faculty
					</button>
				</FormLayout>
			</div>
		</div>
	);
};

export default AddFaculty;
