import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreateClub = () => {
	const [formData, setFormData] = useState({
		clubName: "",
		shortName: "",
		motto: "",
		description: "",
		collegeId: "",
		presidentId: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const facultyId = "67c9f49d5563ae44383c1f33";
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`http://localhost:3002/faculty/create/club/${facultyId}`,
				formData
			);

			toast.success(response.data.message);
			setFormData({
				clubName: "",
				shortName: "",
				motto: "",
				description: "",
				collegeId: "",
				presidentId: "",
			});
		} catch (error) {
			console.error("Error creating club:", error);
			toast.error(
				error.response?.data?.message ||
					"Failed to create club. Please try again."
			);
		}
	};

	return (
		<div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-md">
			<h2 className="text-2xl font-bold mb-6">Create a New Club</h2>
			<form
				onSubmit={handleSubmit}
				className="space-y-4"
			>
				<input
					name="clubName"
					placeholder="Club Name"
					value={formData.clubName}
					onChange={handleChange}
					className="input-field"
					required
				/>
				<input
					name="shortName"
					placeholder="Short Name"
					value={formData.shortName}
					onChange={handleChange}
					className="input-field"
				/>
				<input
					name="motto"
					placeholder="Motto"
					value={formData.motto}
					onChange={handleChange}
					className="input-field"
				/>
				<textarea
					name="description"
					placeholder="Description"
					value={formData.description}
					onChange={handleChange}
					className="input-field"
				/>
				<input
					name="collegeId"
					placeholder="College ID"
					value={formData.collegeId}
					onChange={handleChange}
					className="input-field"
					required
				/>
				<input
					name="presidentId"
					placeholder="President ID"
					value={formData.presidentId}
					onChange={handleChange}
					className="input-field"
					required
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				>
					Create Club
				</button>
			</form>
		</div>
	);
};

export default CreateClub;

// Let me know if you want me to add faculty options or handle dropdowns for selecting users! 🚀
