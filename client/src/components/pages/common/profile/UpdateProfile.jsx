import React, { useState } from "react";

import { toast, ToastContainer } from "react-toastify";
import { API_URL, getToken } from "../../../../routes/apiConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const UpdateProfile = ({ user, closeModal }) => {
	const [formData, setFormData] = useState({
		fullName: user.fullName || "",
		email: user.email || "",
		phoneNumber: user.phoneNumber || "",
		socialLinks: user.socialLinks || {
			linkedIn: "",
			twitter: "",
			github: "",
			personalWebsite: "",
		},
		awards: user.awards || [],
		address: user.address || {
			street: "",
			city: "",
			state: "",
			zipCode: "",
			country: "",
		},
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSocialLinkChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			socialLinks: {
				...prev.socialLinks,
				[name]: value,
			},
		}));
	};

	const handleAddressChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			address: {
				...prev.address,
				[name]: value,
			},
		}));
	};

	// Handle Awards Change
	const handleAwardChange = (index, e) => {
		const { name, value } = e.target;
		const updatedAwards = [...formData.awards];
		updatedAwards[index] = { ...updatedAwards[index], [name]: value };
		setFormData((prev) => ({ ...prev, awards: updatedAwards }));
	};

	// Handle Image Upload for Awards
	const handleImageChange = (index, e) => {
		const file = e.target.files[0];
		if (file) {
			const updatedAwards = [...formData.awards];
			updatedAwards[index].image = URL.createObjectURL(file);
			setFormData((prev) => ({ ...prev, awards: updatedAwards }));
		}
	};

	// Add New Award
	const addAward = () => {
		setFormData((prev) => ({
			...prev,
			awards: [
				...prev.awards,
				{ title: "", description: "", date: "", image: "" },
			],
		}));
	};

	const navigate = useNavigate();
	// Remove an Award
	const removeAward = (index) => {
		const updatedAwards = formData.awards.filter((_, i) => i !== index);
		setFormData((prev) => ({ ...prev, awards: updatedAwards }));
	};

	const handleSubmit = async (e) => {
		console.log("as", formData);
		e.preventDefault();

		const token = getToken();
		await axios.put(`${API_URL}/auth/updateProfile`, formData, {
			headers: { Authorization: `Bearer ${token}` },
		});
		alert("Profile updated successfully!");
		navigate(`/${user.role}/profile/${user._id}`);
		closeModal();
		if (!formData.email) {
			toast.error("Email is required!");
			return;
		}

		// Simulate API call or validation
		setTimeout(() => {
			toast.success("Profile updated successfully!");
			// closeModal();
		}, 1000);
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
			<ToastContainer
				position="top-right"
				reverseOrder={false}
			/>{" "}
			{/* Toaster Component */}
			<div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">
					Update Profile
				</h2>

				<form
					onSubmit={handleSubmit}
					className="space-y-4"
				>
					{/* Full Name */}
					<div>
						<label className="block text-gray-700">Full Name</label>
						<input
							type="text"
							name="fullName"
							value={formData.fullName}
							onChange={handleChange}
							className="w-full p-2 border rounded-lg"
						/>
					</div>

					{/* Email */}
					<div>
						<label className="block text-gray-700">Email</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full p-2 border rounded-lg"
						/>
					</div>

					{/* Phone Number */}
					<div>
						<label className="block text-gray-700">Phone Number</label>
						<input
							type="text"
							name="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleChange}
							className="w-full p-2 border rounded-lg"
						/>
					</div>

					<div className="bg-gray-100 p-4 roumded-md">
						<h3 className="font-semibolde text-gray-700 mb-2">Address</h3>
						{["street", "city", "state", "zipCode", "country"].map((link) => (
							<div
								key={link}
								className="mb-2"
							>
								<label className="bloack text-gray-600 capitalize">
									{link}
								</label>
								<input
									type="text"
									name={link}
									value={formData.address[link]}
									onChange={handleAddressChange}
									className="w-full p-2 border rounded-lg"
								/>
							</div>
						))}
					</div>
					{/* Social Links */}
					<div className="bg-gray-100 p-4 rounded-md">
						<h3 className="font-semibold text-gray-700 mb-2">Social Links</h3>
						{["linkedIn", "twitter", "github", "personalWebsite"].map(
							(link) => (
								<div
									key={link}
									className="mb-2"
								>
									<label className="block text-gray-600 capitalize">
										{link}
									</label>
									<input
										type="text"
										name={link}
										value={formData.socialLinks[link]}
										onChange={handleSocialLinkChange}
										className="w-full p-2 border rounded-lg"
									/>
								</div>
							)
						)}
					</div>

					{/* Awards Section */}
					<div className="bg-gray-100 p-4 rounded-md">
						<h3 className="font-semibold text-gray-700 mb-2">Awards</h3>
						{formData.awards.map((award, index) => (
							<div
								key={index}
								className="mb-4 p-2 border rounded-md relative"
							>
								<label className="block text-gray-700">Title</label>
								<input
									type="text"
									name="title"
									value={award.title}
									onChange={(e) => handleAwardChange(index, e)}
									className="w-full p-2 border rounded-lg"
								/>

								<label className="block text-gray-700 mt-2">Description</label>
								<input
									type="text"
									name="description"
									value={award.description}
									onChange={(e) => handleAwardChange(index, e)}
									className="w-full p-2 border rounded-lg"
								/>

								<label className="block text-gray-700 mt-2">Date</label>
								<input
									type="date"
									name="date"
									value={award.date}
									onChange={(e) => handleAwardChange(index, e)}
									className="w-full p-2 border rounded-lg"
								/>

								{/* Image Upload */}
								<label className="block text-gray-700 mt-2">Upload Image</label>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => handleImageChange(index, e)}
									className="w-full p-2 border rounded-lg"
								/>

								{/* Preview Image */}
								{award.image && (
									<img
										src={award.image}
										alt="Award Preview"
										className="w-20 h-20 object-cover mt-2 rounded-md"
									/>
								)}

								{/* Remove Award Button */}
								<button
									type="button"
									onClick={() => removeAward(index)}
									className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
								>
									X
								</button>
							</div>
						))}

						{/* Add Award Button */}
						<button
							type="button"
							onClick={addAward}
							className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
						>
							+ Add Award
						</button>
					</div>

					{/* Submit & Close Buttons */}
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							onClick={closeModal}
							className="px-4 py-2 bg-gray-500 text-white rounded-lg"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white rounded-lg"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UpdateProfile;
