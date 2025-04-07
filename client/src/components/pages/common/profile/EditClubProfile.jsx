import React, { useState, useEffect } from "react";

const EditClubProfile = ({ clubData, onSave, onCancel }) => {
	const [formData, setFormData] = useState({
		clubName: "",
		shortName: "",
		motto: "",
		description: "",
		logo: "",
		socialLinks: {
			linkedIn: "",
			twitter: "",
			github: "",
			personalWebsite: "",
		},
		foundingYear: "",
		maxMembers: 100,
	});

	useEffect(() => {
		if (clubData) setFormData(clubData);
	}, [clubData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
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

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(formData); // Save changes
	};

	return (
		<div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
			<h2 className="text-2xl font-bold mb-4">Edit Club Profile</h2>

			<form
				onSubmit={handleSubmit}
				className="space-y-5"
			>
				<div>
					<label className="block font-medium">Club Name</label>
					<input
						type="text"
						name="clubName"
						value={formData.clubName}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded mt-1"
						required
					/>
				</div>

				<div>
					<label className="block font-medium">Short Name</label>
					<input
						type="text"
						name="shortName"
						value={formData.shortName}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded mt-1"
						required
					/>
				</div>

				<div>
					<label className="block font-medium">Motto</label>
					<input
						type="text"
						name="motto"
						value={formData.motto}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded mt-1"
					/>
				</div>

				<div>
					<label className="block font-medium">Description</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded mt-1"
						rows="4"
					></textarea>
				</div>

				<div>
					<h3 className="font-semibold mt-4 mb-2">Social Links</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{["linkedIn", "twitter", "github", "personalWebsite"].map((key) => (
							<input
								key={key}
								type="text"
								name={`socialLinks.${key}`}
								placeholder={`${
									key.charAt(0).toUpperCase() + key.slice(1)
								} URL`}
								value={formData.socialLinks[key]}
								onChange={handleChange}
								className="w-full border px-3 py-2 rounded"
							/>
						))}
					</div>
				</div>

				<div className="flex justify-end gap-3 mt-6">
					<button
						type="button"
						className="px-4 py-2 rounded border text-gray-600"
						onClick={onCancel}
					>
						Cancel
					</button>
					<button
						type="submit"
						className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
					>
						Save Changes
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditClubProfile;
