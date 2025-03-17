import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import FormLayout from "../common/FormComponent";

const AddCollege = ({ onClose }) => {
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

			toast.success("College created successfully");
			onClose(); // Close modal on success
		} catch (error) {
			console.error("Error:", error.response?.data || error);
			toast.error(error.response?.data.message || "Failed to create college");
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

				<h2 className="text-xl font-bold mb-4">Add College</h2>

				<FormLayout
					title="Add College"
					onSubmit={handleSubmit}
				>
					<input
						type="text"
						name="name"
						placeholder="College Name"
						value={collegeData.name}
						onChange={handleChange}
						className="input-field"
						required
					/>
					<input
						type="text"
						name="collegeCode"
						placeholder="College Code"
						value={collegeData.collegeCode}
						onChange={handleChange}
						className="input-field"
						required
					/>
					<input
						type="text"
						name="universityAffiliation"
						placeholder="University Affiliation"
						value={collegeData.universityAffiliation}
						onChange={handleChange}
						className="input-field"
						required
					/>
					<input
						type="text"
						name="address"
						placeholder="Address"
						value={collegeData.address}
						onChange={handleChange}
						className="input-field"
						required
					/>
					<input
						type="text"
						name="contactInfo"
						placeholder="Contact Info"
						value={collegeData.contactInfo}
						onChange={handleChange}
						className="input-field"
						required
					/>
					<input
						type="number"
						name="establishedYear"
						placeholder="Established Year"
						value={collegeData.establishedYear}
						onChange={handleChange}
						className="input-field"
						required
					/>

					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
					>
						Create College
					</button>
				</FormLayout>
			</div>
		</div>
	);
};

export default AddCollege;
