import { useState } from "react";
import { Button, Input, TextareaAutosize } from "@mui/material";
import DialogComponent from "../../../common/DialogComponent";
import axios from "axios";
import { API_URL, getToken } from "../../../../routes/apiConfig";

export const UpdateClubProfile = ({ club, open, setOpen }) => {
	const [formData, setFormData] = useState({ ...club });

	const handleChange = (e) => {
		const { name, value } = e.target;
		// Handle nested object updates (socialLinks)
		if (name.startsWith("socialLinks.")) {
			const key = name.split(".")[1];
			setFormData((prev) => ({
				...prev,
				socialLinks: { ...prev.socialLinks, [key]: value },
			}));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = getToken();
			const response = await axios.put(
				`${API_URL}/student/club/${club._id}`,
				formData,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			console.log("Data for Update", formData);
			setOpen(false);
			console.log(response.data);
		} catch (error) {
			console.error("Error updating club profile:", error);
			throw error;
		}
	};

	return (
		<DialogComponent
			title="Update Club Profile"
			open={open}
			onClose={() => setOpen(false)}
		>
			<form
				onSubmit={handleSubmit}
				className="space-y-4 p-4"
			>
				{/* Club Name */}
				<label className="block font-medium text-gray-700">Club Name</label>
				<Input
					name="clubName"
					value={formData.clubName || ""}
					onChange={handleChange}
					fullWidth
					required
				/>

				{/* Short Name */}
				<label className="block font-medium text-gray-700">Short Name</label>
				<Input
					name="shortName"
					value={formData.shortName || ""}
					onChange={handleChange}
					fullWidth
					required
				/>

				{/* Motto */}
				<label className="block font-medium text-gray-700">Motto</label>
				<TextareaAutosize
					name="motto"
					value={formData.motto || ""}
					onChange={handleChange}
					className="w-full border p-2 rounded-md"
				/>

				{/* Description */}
				<label className="block font-medium text-gray-700">Description</label>
				<TextareaAutosize
					name="description"
					value={formData.description || ""}
					onChange={handleChange}
					className="w-full border p-2 rounded-md"
				/>

				{/* Logo URL */}
				<label className="block font-medium text-gray-700">Logo URL</label>
				<Input
					name="logo"
					value={formData.logo || ""}
					onChange={handleChange}
					fullWidth
				/>

				{/* Profile Picture URL */}
				<label className="block font-medium text-gray-700">
					Profile Picture URL
				</label>
				<Input
					name="profilePicture"
					value={formData.profilePicture || ""}
					onChange={handleChange}
					fullWidth
				/>

				{/* Social Links */}
				<div className="grid grid-cols-2 gap-2">
					<div>
						<label className="block font-medium text-gray-700">LinkedIn</label>
						<Input
							name="socialLinks.linkedIn"
							value={formData.socialLinks?.linkedIn || ""}
							onChange={handleChange}
							fullWidth
						/>
					</div>
					<div>
						<label className="block font-medium text-gray-700">Twitter</label>
						<Input
							name="socialLinks.twitter"
							value={formData.socialLinks?.twitter || ""}
							onChange={handleChange}
							fullWidth
						/>
					</div>
					<div>
						<label className="block font-medium text-gray-700">GitHub</label>
						<Input
							name="socialLinks.github"
							value={formData.socialLinks?.github || ""}
							onChange={handleChange}
							fullWidth
						/>
					</div>
					<div>
						<label className="block font-medium text-gray-700">Website</label>
						<Input
							name="socialLinks.personalWebsite"
							value={formData.socialLinks?.personalWebsite || ""}
							onChange={handleChange}
							fullWidth
						/>
					</div>
				</div>

				{/* Save Button */}
				<Button
					type="submit"
					className="w-full bg-green-500 text-white py-2 rounded-lg shadow-md hover:bg-green-600"
				>
					Save Changes
				</Button>
			</form>
		</DialogComponent>
	);
};
