import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// import { API_URL } from "../config";
import { format } from "date-fns";
import { API_URL, getUser } from "../../../../routes/apiConfig";

const CollegeProfilePage = () => {
	// const { collegeId } = useParams();
	const collegeId = "67f0b94e49541ac6e2432033";
	const [college, setCollege] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const [logoFile, setLogoFile] = useState(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleLogoChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const previewUrl = URL.createObjectURL(file);
			setCollege((prev) => ({
				...prev,
				logoPreview: previewUrl,
			}));
			setLogoFile(file);
		}
	};
	const handleLogoUpload = async () => {
		if (!logoFile) return;

		setIsUploading(true);
		try {
			const formData = new FormData();
			formData.append("logo", logoFile);

			const response = await axios.put(
				`${API_URL}/admin/${collegeId}/logo`,
				formData
			);

			setCollege((prev) => ({
				...prev,
				logo: response.data.logo,
				logoPreview: null,
			}));
			setLogoFile(null);
		} catch (error) {
			console.error("Logo upload failed:", error);
			// Handle error
		} finally {
			setIsUploading(false);
		}
	};

	const handleLogoCancel = () => {
		setCollege((prev) => ({
			...prev,
			logoPreview: null,
		}));
		setLogoFile(null);
	};
	useEffect(() => {
		if (!collegeId) {
			console.error("No college ID found");
			return;
		}

		const fetchCollege = async () => {
			try {
				const response = await axios.get(`${API_URL}/admin/${collegeId}`);
				setCollege(response.data);
			} catch (error) {
				console.error("Fetch error:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCollege();
	}, [collegeId]); // ✅ collegeId is a dependency

	const user  = getUser()
	const handleEdit = () => {
		// Navigate to edit route with college ID
		navigate(`/${user.role}/colleges/${college._id}/edit`);
	};
	if (loading) return <div className="text-center py-8">Loading...</div>;
	if (!college)
		return <div className="text-center py-8">College not found</div>;

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<div className="border p-4 m-2 rounded-lg shadow-md">
				{/* <h3 className="text-xl font-bold">{college.name}</h3>
				<p>{college.description}</p> */}
				<button
					onClick={handleEdit}
					className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				>
					Edit College
				</button>
			</div>
			{/* Header Section */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-8">
				<div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg shadow-xl p-6 mb-8 transform transition-all hover:shadow-2xl relative">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-4xl font-bold text-white drop-shadow-md">
								{college.name}
							</h1>
							<p className="text-xl text-blue-100 mt-2">
								{college.description}
							</p>
						</div>

						<div className="group relative">
							<div className="p-2 bg-white rounded-full shadow-lg hover:rotate-6 transition-transform relative">
								<img
									src={college.logoPreview || college.logo}
									alt="College Logo"
									className="h-32 w-32 object-contain rounded-full"
								/>

								{/* Edit Overlay */}
								<div
									className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   cursor-pointer z-10"
								>
									<button
										onClick={() => document.getElementById("logoInput").click()}
										className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm
                   transform hover:scale-105 transition-transform"
									>
										Change Logo
									</button>
								</div>
							</div>
						</div>
						{/* Hidden File Input */}
						<input
							type="file"
							id="logoInput"
							accept="image/*"
							className="hidden"
							onChange={handleLogoChange}
						/>
					</div>

					{/* Upload Controls */}
					{college.logoPreview && (
						<div className="flex gap-4 justify-end mt-4">
							<button
								onClick={handleLogoUpload}
								className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
							>
								Save Logo
							</button>
							<button
								onClick={handleLogoCancel}
								className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
							>
								Cancel
							</button>
						</div>
					)}
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
					<InfoItem
						label="College Code"
						value={college.collegeCode}
					/>
					<InfoItem
						label="Established"
						value={college.establishedYear}
					/>
					<InfoItem
						label="Ranking"
						value={`#${college.ranking}`}
					/>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column */}
				<div className="lg:col-span-2 space-y-8">
					{/* Accreditation Section */}
					<SectionCard title="Accreditation Details">
						<div className="grid grid-cols-2 gap-4">
							<InfoItem
								label="Accreditation Body"
								value={college.accreditationDetails?.body}
							/>
							<InfoItem
								label="Accreditation Grade"
								value={college.accreditationDetails?.grade}
							/>
						</div>
					</SectionCard>

					{/* Performance Metrics */}
					<SectionCard title="Performance Highlights">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<MetricCard
								label="Placement Rate"
								value={`${college.performanceMetrics?.placementRate}%`}
							/>
							<MetricCard
								label="Research Papers"
								value={college.performanceMetrics?.researchPapersPublished}
							/>
							<MetricCard
								label="Faculty-Student Ratio"
								value={college.performanceMetrics?.facultyStudentRatio}
							/>
						</div>
					</SectionCard>

					{/* Campus Infrastructure */}
					<SectionCard title="Campus Infrastructure">
						<div className="space-y-4">
							<InfoItem
								label="Campus Area"
								value={`${college.campusArea} sq.ft`}
							/>
							<InfoItem
								label="Hostels"
								value={college.hostelsAvailable ? "Available" : "Not Available"}
							/>

							<div className="mt-4">
								<h4 className="font-semibold mb-2">Library Facilities</h4>
								<div className="grid grid-cols-2 gap-4">
									<InfoItem
										label="Total Books"
										value={college.libraryDetails?.booksCount}
									/>
									<InfoItem
										label="Digital Access"
										value={college.libraryDetails?.digitalAccess ? "Yes" : "No"}
									/>
								</div>
							</div>

							<div className="mt-4">
								<h4 className="font-semibold mb-2">Laboratories</h4>
								<div className="flex flex-wrap gap-2">
									{college.labs?.map((lab, index) => (
										<span
											key={index}
											className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
										>
											{lab}
										</span>
									))}
								</div>
							</div>
						</div>
					</SectionCard>
				</div>

				{/* Right Column */}
				<div className="space-y-8">
					{/* Contact Information */}
					<SectionCard title="Contact Details">
						<div className="space-y-3">
							<InfoItem
								label="Address"
								value={`${college.address?.street}, ${college.address?.city}, 
                 ${college.address?.state}, ${college.address?.country} - ${college.address?.zipCode}`}
							/>
							<InfoItem
								label="Phone"
								value={college.contactInfo?.phoneNumber}
							/>
							<InfoItem
								label="Email"
								value={college.contactInfo?.email}
							/>
							<InfoItem
								label="Website"
								value={college.contactInfo?.website}
								link
							/>
						</div>
					</SectionCard>

					{/* Social Links */}
					<SectionCard title="Connect With Us">
						<div className="flex space-x-4">
							{college.socialLinks?.linkedIn && (
								<SocialLink
									href={college.socialLinks.linkedIn}
									platform="LinkedIn"
								/>
							)}
							{college.socialLinks?.twitter && (
								<SocialLink
									href={college.socialLinks.twitter}
									platform="Twitter"
								/>
							)}
							{college.socialLinks?.facebook && (
								<SocialLink
									href={college.socialLinks.facebook}
									platform="Facebook"
								/>
							)}
							{college.socialLinks?.instagram && (
								<SocialLink
									href={college.socialLinks.instagram}
									platform="Instagram"
								/>
							)}
						</div>
					</SectionCard>

					{/* Admin Details */}
					<SectionCard title="Administration">
						<div className="space-y-2">
							<InfoItem
								label="Created By"
								value={college.adminDetails?.fullName || "N/A"}
							/>
						</div>
					</SectionCard>
				</div>
			</div>
		</div>
	);
};

// Enhanced Section Card with Hover
const SectionCard = ({ title, children }) => (
	<div
		className="bg-white rounded-lg shadow-md p-6 transition-all 
       hover:shadow-lg hover:-translate-y-1 border-l-4 border-blue-100
       hover:border-blue-500"
	>
		<h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
			<span className="mr-2">📚</span> {/* Icon */}
			{title}
		</h2>
		{children}
	</div>
);

const InfoItem = ({ label, value, link }) => (
	<div className="mb-3 group">
		<dt className="text-sm font-medium text-blue-600">{label}</dt>
		<dd
			className="mt-1 text-gray-800 break-words border-b border-dashed 
         border-transparent group-hover:border-blue-200 transition-all"
		>
			{link ? (
				<a
					href={value}
					className="text-blue-700 hover:text-blue-900 font-medium 
               underline decoration-blue-200 hover:decoration-blue-400"
				>
					{value}
				</a>
			) : (
				<span className="text-gray-700">{value || "N/A"}</span>
			)}
		</dd>
	</div>
);

const MetricCard = ({ label, value }) => (
	<div
		className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg 
       text-center border border-blue-200 hover:border-blue-400 transition-colors"
	>
		<div className="text-2xl font-bold text-blue-800">{value}</div>
		<div className="text-sm text-blue-600 mt-1">{label}</div>
	</div>
);

const SocialLink = ({ href, platform }) => (
	<a
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		className="text-blue-600 hover:text-blue-800 transition-colors
         flex items-center space-x-2"
	>
		<span className="text-xl">
			{platform === "LinkedIn" && "👔"}
			{platform === "Twitter" && "🐦"}
			{platform === "Facebook" && "📘"}
			{platform === "Instagram" && "📸"}
		</span>
		<span className="text-sm font-medium">{platform}</span>
	</a>
);

export default CollegeProfilePage;
