import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../../routes/apiConfig";
import { useParams } from "react-router-dom";

const UpdateCollegeProfile = () => {
	const { id } = useParams();
	// const id = "67f0b94e49541ac6e2432033";
	const [originalData, setOriginalData] = useState(null);
	const [collegeData, setCollegeData] = useState({});
	const [logoFile, setLogoFile] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCollege = async () => {
			// console.log(id);
			try {
				const res = await axios.get(`${API_URL}/admin/${id}`);
				setOriginalData(res.data);
				setCollegeData(res.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching college data:", error);
				setLoading(false);
			}
		};
		fetchCollege();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		// Handle nested fields using dot notation
		if (name.includes(".")) {
			const [parent, child] = name.split(".");
			setCollegeData((prev) => ({
				...prev,
				[parent]: {
					...prev[parent],
					[child]: value,
				},
			}));
		} else {
			setCollegeData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleArrayChange = (index, value, field) => {
		setCollegeData((prev) => {
			const updatedArray = [...prev[field]];
			updatedArray[index] = value;
			return { ...prev, [field]: updatedArray };
		});
	};

	const addLabField = () => {
		setCollegeData((prev) => ({
			...prev,
			labs: [...prev.labs, ""],
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			console.log("id", id);
			const response = await axios.put(
				`${API_URL}/admin/${id}/update`,
				collegeData
			);

			if (response.status === 200) {
				alert("College profile updated successfully!");
				// Refresh data from server
				const freshData = await axios.get(`${API_URL}/admin/${id}/update`);
				setOriginalData(freshData.data);
				setCollegeData(freshData.data);
			}
		} catch (error) {
			let errorMessage = "Failed to update college profile";

			if (error.response) {
				// Server responded with status code 4xx/5xx
				errorMessage = error.response.data.message || error.response.statusText;
			} else if (error.request) {
				// Request was made but no response received
				errorMessage = "No response from server - check network connection";
			}

			console.error("Update error:", errorMessage);
			alert(errorMessage);
		}
	};
	// Reusable field component with previous value display
	const renderField = (label, name, value, type = "text", previousValue) => (
		<div className="space-y-1">
			<label className="block text-sm font-medium text-gray-700">{label}</label>
			<input
				type={type}
				name={name}
				value={value || ""}
				onChange={handleChange}
				className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
			{previousValue !== undefined && (
				<p className="text-sm text-gray-500">
					Previous: {previousValue || "N/A"}
				</p>
			)}
		</div>
	);

	if (loading) return <div className="text-center py-8">Loading...</div>;

	return (
		<div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">
				Update College Profile
			</h2>

			<form
				onSubmit={handleSubmit}
				className="space-y-6"
			>
				{/* Basic Information Section */}
				<div className="bg-gray-50 p-6 rounded-lg">
					<h3 className="text-xl font-semibold mb-4 text-gray-700">
						Basic Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{renderField(
							"College Name",
							"name",
							collegeData.name,
							"text",
							originalData.name
						)}
						{renderField(
							"College Code",
							"collegeCode",
							collegeData.collegeCode,
							"text",
							originalData.collegeCode
						)}
						{renderField(
							"Description",
							"description",
							collegeData.description,
							"text",
							originalData.description
						)}
						{renderField(
							"University Affiliation",
							"universityAffiliation",
							collegeData.universityAffiliation,
							"text",
							originalData.universityAffiliation
						)}
						{renderField(
							"Ranking",
							"ranking",
							collegeData.ranking,
							"number",
							originalData.ranking
						)}
						{renderField(
							"Established Year",
							"establishedYear",
							collegeData.establishedYear,
							"number",
							originalData.establishedYear
						)}
					</div>
				</div>
				{/* Accreditation Section */}
				<div className="bg-gray-50 p-6 rounded-lg">
					<h3 className="text-xl font-semibold mb-4 text-gray-700">
						Accreditation Details
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{renderField(
							"Accreditation Body",
							"accreditationDetails.body",
							collegeData.accreditationDetails?.body,
							"text",
							originalData.accreditationDetails?.body
						)}
						{renderField(
							"Accreditation Grade",
							"accreditationDetails.grade",
							collegeData.accreditationDetails?.grade,
							"text",
							originalData.accreditationDetails?.grade
						)}
					</div>
				</div>
				{/* Address Section */}
				<div className="bg-gray-50 p-6 rounded-lg">
					<h3 className="text-xl font-semibold mb-4 text-gray-700">Address</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{renderField(
							"Street",
							"address.street",
							collegeData.address?.street,
							"text",
							originalData.address?.street
						)}
						{renderField(
							"City",
							"address.city",
							collegeData.address?.city,
							"text",
							originalData.address?.city
						)}
						{renderField(
							"State",
							"address.state",
							collegeData.address?.state,
							"text",
							originalData.address?.state
						)}
						{renderField(
							"Country",
							"address.country",
							collegeData.address?.country,
							"text",
							originalData.address?.country
						)}
						{renderField(
							"Zip Code",
							"address.zipCode",
							collegeData.address?.zipCode,
							"text",
							originalData.address?.zipCode
						)}
					</div>
				</div>
				{/* Labs Section */}
				<div className="bg-gray-50 p-6 rounded-lg">
					<h3 className="text-xl font-semibold mb-4 text-gray-700">
						Laboratories
					</h3>
					<div className="space-y-3">
						{collegeData.labs?.map((lab, index) => (
							<div
								key={index}
								className="flex items-center gap-2"
							>
								<input
									type="text"
									value={lab}
									onChange={(e) =>
										handleArrayChange(index, e.target.value, "labs")
									}
									className="flex-1 p-2 border rounded"
									placeholder={`Lab ${index + 1}`}
								/>
								<span className="text-sm text-gray-500">
									Previous: {originalData.labs?.[index] || "N/A"}
								</span>
							</div>
						))}
						<button
							type="button"
							onClick={addLabField}
							className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
						>
							+ Add Lab
						</button>
					</div>
				</div>
				
				<div className="bg-gray-50 p-6 rounded-lg">
					<h3 className="text-xl font-semibold mb-4 text-gray-700">
						Social Links
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{renderField(
							"LinkedIn",
							"socialLinks.linkedIn",
							collegeData.socialLinks?.linkedIn,
							"url",
							originalData.socialLinks?.linkedIn
						)}
						{renderField(
							"Twitter",
							"socialLinks.twitter",
							collegeData.socialLinks?.twitter,
							"url",
							originalData.socialLinks?.twitter
						)}
						{renderField(
							"Facebook",
							"socialLinks.facebook",
							collegeData.socialLinks?.facebook,
							"url",
							originalData.socialLinks?.facebook
						)}
						{renderField(
							"Instagram",
							"socialLinks.instagram",
							collegeData.socialLinks?.instagram,
							"url",
							originalData.socialLinks?.instagram
						)}
					</div>
				</div>
				// Performance Metrics Section
				<div className="bg-gray-50 p-6 rounded-lg">
					<h3 className="text-xl font-semibold mb-4 text-gray-700">
						Performance Metrics
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{renderField(
							"Placement Rate (%)",
							"performanceMetrics.placementRate",
							collegeData.performanceMetrics?.placementRate,
							"number",
							originalData.performanceMetrics?.placementRate
						)}
						{renderField(
							"Research Papers Published",
							"performanceMetrics.researchPapersPublished",
							collegeData.performanceMetrics?.researchPapersPublished,
							"number",
							originalData.performanceMetrics?.researchPapersPublished
						)}
						{renderField(
							"Faculty-Student Ratio",
							"performanceMetrics.facultyStudentRatio",
							collegeData.performanceMetrics?.facultyStudentRatio,
							"number",
							originalData.performanceMetrics?.facultyStudentRatio
						)}
					</div>
				</div>
				// Campus Infrastructure Section
				<div className="bg-gray-50 p-6 rounded-lg">
					<h3 className="text-xl font-semibold mb-4 text-gray-700">
						Campus Infrastructure
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{renderField(
							"Campus Area (sq ft)",
							"campusArea",
							collegeData.campusArea,
							"number",
							originalData.campusArea
						)}
						<div className="space-y-1">
							<label className="block text-sm font-medium text-gray-700">
								Hostels Available
							</label>
							<input
								type="checkbox"
								name="hostelsAvailable"
								checked={collegeData.hostelsAvailable || false}
								onChange={(e) =>
									handleChange({
										target: {
											name: "hostelsAvailable",
											value: e.target.checked,
										},
									})
								}
								className="mt-1"
							/>
							<p className="text-sm text-gray-500">
								Previous: {originalData.hostelsAvailable?.toString() || "N/A"}
							</p>
						</div>
					</div>
				</div>
				// Library Details Section
				<div className="bg-gray-50 p-6 rounded-lg">
					<h3 className="text-xl font-semibold mb-4 text-gray-700">
						Library Details
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{renderField(
							"Books Count",
							"libraryDetails.booksCount",
							collegeData.libraryDetails?.booksCount,
							"number",
							originalData.libraryDetails?.booksCount
						)}
						<div className="space-y-1">
							<label className="block text-sm font-medium text-gray-700">
								Digital Access
							</label>
							<input
								type="checkbox"
								name="libraryDetails.digitalAccess"
								checked={collegeData.libraryDetails?.digitalAccess || false}
								onChange={(e) =>
									handleChange({
										target: {
											name: "libraryDetails.digitalAccess",
											value: e.target.checked,
										},
									})
								}
								className="mt-1"
							/>
							<p className="text-sm text-gray-500">
								Previous:{" "}
								{originalData.libraryDetails?.digitalAccess?.toString() ||
									"N/A"}
							</p>
						</div>
					</div>
				</div>
				{/* Submit Button */}
				<div className="text-center">
					<button
						type="submit"
						className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
					>
						Update Profile
					</button>
				</div>
			</form>

			{/* Logo Upload Section */}
		</div>
	);
};

export default UpdateCollegeProfile;
