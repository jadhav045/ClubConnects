import React, { useState } from "react";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Link,
	Calendar,
	Save,
	Edit,
} from "lucide-react";



const Profile = ({user}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({ ...user });

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = () => {
		// Handle save logic (API call, etc.)
		setIsEditing(false);
	};

	return (
		<div className="p-6 grid gap-6">
			<div className="shadow-xl rounded-2xl p-6 bg-white">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold flex items-center gap-2">
						<User className="w-6 h-6" /> Profile
					</h2>
					{isEditing ? (
						<button
							onClick={handleSave}
							className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
						>
							<Save className="w-5 h-5" /> Save
						</button>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg"
						>
							<Edit className="w-5 h-5" /> Edit Profile
						</button>
					)}
				</div>

				<section className="grid grid-cols-2 gap-6">
					<div>
						<h3 className="text-xl font-semibold flex items-center gap-2">
							<User className="w-5 h-5" /> Personal Information
						</h3>
						{isEditing ? (
							<input
								name="fullName"
								value={formData.fullName}
								onChange={handleChange}
								placeholder="Full Name"
								className="border p-2 w-full rounded-lg"
							/>
						) : (
							<p>{user?.fullName}</p>
						)}
						<p className="flex items-center gap-2">
							<Mail className="w-5 h-5" /> Email: {user.email}
						</p>
						<p>PRN: {user.prn}</p>
						<p>Role: {user.role}</p>
					</div>

					<div>
						<h3 className="text-xl font-semibold flex items-center gap-2">
							<Phone className="w-5 h-5" /> Contact Details
						</h3>
						{isEditing ? (
							<input
								name="phoneNumber"
								value={formData.phoneNumber}
								onChange={handleChange}
								placeholder="Phone Number"
								className="border p-2 w-full rounded-lg"
							/>
						) : (
							<p>Phone: {user.phoneNumber}</p>
						)}
						<p>Gender: {user.gender}</p>
						<p className="flex items-center gap-2">
							<Calendar className="w-5 h-5" /> Date of Birth:{" "}
							{new Date(user.dateOfBirth).toLocaleDateString()}
						</p>
					</div>
				</section>

				<section className="mt-6">
					<h3 className="text-xl font-semibold flex items-center gap-2">
						<MapPin className="w-5 h-5" /> Address
					</h3>
					{isEditing ? (
						<textarea
							name="address"
							value={formData.address?.street}
							onChange={handleChange}
							placeholder="Address"
							className="border p-2 w-full rounded-lg"
						/>
					) : (
						<p>{`${user.address?.street}, ${user.address?.city}, ${user.address?.state}, ${user.address?.zipCode}, ${user.address?.country}`}</p>
					)}
				</section>

				<section className="mt-6">
					<h3 className="text-xl font-semibold flex items-center gap-2">
						<Link className="w-5 h-5" /> Social Links
					</h3>
					<ul>
						{isEditing ? (
							<>
								<input
									name="socialLinks.linkedIn"
									value={formData.socialLinks?.linkedIn || ""}
									onChange={handleChange}
									placeholder="LinkedIn URL"
									className="border p-2 w-full rounded-lg mb-2"
								/>
								<input
									name="socialLinks.twitter"
									value={formData.socialLinks?.twitter || ""}
									onChange={handleChange}
									placeholder="Twitter URL"
									className="border p-2 w-full rounded-lg mb-2"
								/>
								<input
									name="socialLinks.github"
									value={formData.socialLinks?.github || ""}
									onChange={handleChange}
									placeholder="GitHub URL"
									className="border p-2 w-full rounded-lg mb-2"
								/>
								<input
									name="socialLinks.personalWebsite"
									value={formData.socialLinks?.personalWebsite || ""}
									onChange={handleChange}
									placeholder="Website URL"
									className="border p-2 w-full rounded-lg"
								/>
							</>
						) : (
							<>
								<li>LinkedIn: {user.socialLinks?.linkedIn}</li>
								<li>Twitter: {user.socialLinks?.twitter}</li>
								<li>GitHub: {user.socialLinks?.github}</li>
								<li>Website: {user.socialLinks?.personalWebsite}</li>
							</>
						)}
					</ul>
				</section>
			</div>
		</div>
	);
};

export default Profile;

// Let me know if you want me to tweak anything else! 🚀
