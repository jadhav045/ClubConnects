import React, { useEffect, useState } from "react";
import { API_URL, getToken } from "../../../../routes/apiConfig";
import axios from "axios";
import { MoreVertical } from "lucide-react";
import { setClubs } from "../../../../store/slice/clubSlice";
import { useClubCard } from "../../club/ClubCardLogic";

const ClubProfileCard = ({ data, onEditClick }) => {
	console.log("C", data);

	const [showModal, setShowModal] = useState(false);
	const [newAchievement, setNewAchievement] = useState({
		title: "",
		description: "",
		date: "",
		image: "",
	});
	const [showAll, setShowAll] = useState(false);

	const visibleAchievements = showAll
		? data.achievements
		: data.achievements.slice(0, 2);

	const [file, setFile] = useState(null);

	const handleChange = (e) => {
		setNewAchievement({ ...newAchievement, [e.target.name]: e.target.value });
	};
	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const { presidents } = useClubCard(data);
	console.log("President", presidents.name);
	const handleAddAchievement = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("title", newAchievement.title);
		formData.append("description", newAchievement.description);
		formData.append("date", newAchievement.date);
		if (file) {
			formData.append("image", file);
		}

		try {
			const token = getToken();
			const response = await axios.post(
				`${API_URL}/student/club/${data._id}/achievement`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						// "Content-Type": "multipart/form-data",
					},
				}
			);
			console.log("Achievement added:", response.data);

			// Clear form + modal
			setNewAchievement({ title: "", description: "", date: "", image: "" });
			setFile(null);
			setShowModal(false);
			// Optionally, refresh club data
		} catch (error) {
			console.error("Error adding achievement:", error);
		}
	};

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				setSelectedImage(null);
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	const [selectedImage, setSelectedImage] = useState(null);

	const [anchorIdx, setAnchorIdx] = useState(null); // for showing menu
	const [selectedAchievement, setSelectedAchievement] = useState(null); // for editing

	// DELETE handler
	const handleDelete = async (achievementId) => {
		try {
			const token = getToken();
			await axios.delete(
				`${API_URL}/student/club/${data._id}/achievement/${achievementId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setClubs((prev) => ({
				...prev,
				achievements: prev.achievements.filter((a) => a._id !== achievementId),
			}));
			setAnchorIdx(null);
		} catch (err) {
			console.error("Delete failed", err);
		}
	};
	return (
		<div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
			{/* Header */}
			<div className="flex justify-between items-start">
				<div className="flex gap-4">
					<div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
						{data?.shortName?.slice(0, 2)?.toUpperCase()}
					</div>
					<div>
						<h2 className="text-xl font-bold">{data?.clubName}</h2>
						<p className="text-gray-600 text-sm">{data?.shortName}</p>
						<p className="text-gray-500 text-sm">{data?.motto}</p>
					</div>
				</div>
				<div className="flex gap-2">
					<button
						className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
						onClick={onEditClick}
					>
						Edit Profile
					</button>

					<button className="text-gray-600 text-xl">⋯</button>
				</div>
			</div>

			{/* Description */}
			<div className="mt-4">
				<h3 className="font-semibold">Description</h3>
				<p className="text-sm text-gray-700">{data?.description}</p>
			</div>

			{/* Info Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
				<div>
					<p className="font-medium">Founded</p>
					<p>{data?.foundingYear}</p>
				</div>
				<div>
					<p className="font-medium">President</p>
					<p>{presidents.name}</p>
				</div>
				<div>
					<p className="font-medium">Members</p>
					<p>{data?.members.length}</p>
				</div>
				<div>
					<p className="font-medium">Followers</p>
					<p>{data?.followers.length}</p>
				</div>
			</div>

			{/* Social Links */}
			<div className="flex gap-3 mt-4">
				{data?.socialLinks?.linkedIn && (
					<a
						href={data?.socialLinks?.linkedIn}
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
							alt="LinkedIn"
							className="w-5 h-5"
						/>
					</a>
				)}
				{data?.socialLinks?.twitter && (
					<a
						href={data?.socialLinks?.twitter}
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
							alt="Twitter"
							className="w-5 h-5"
						/>
					</a>
				)}
				{data?.socialLinks?.github && (
					<a
						href={data?.socialLinks?.github}
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
							alt="GitHub"
							className="w-5 h-5"
						/>
					</a>
				)}
			</div>
			<div className="mt-8">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
					<button
						onClick={() => setShowModal(true)}
						className="text-sm text-blue-600 hover:underline"
					>
						Add Achievement
					</button>
				</div>

				{visibleAchievements.length > 0 ? (
					<div className="space-y-4">
						{visibleAchievements.map((ach, index) => (
							<div
								key={ach._id || index}
								className="relative flex gap-4 items-start border rounded-md p-4 shadow-sm bg-white"
							>
								{ach.image && (
									<img
										src={ach.image}
										alt={ach.title}
										onClick={() => setSelectedImage(ach.image)}
										className="w-16 h-16 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
									/>
								)}

								<div className="flex-1">
									<p className="text-sm font-semibold text-gray-800">
										{ach.title}
										{ach.date && (
											<span className="ml-2 text-xs text-gray-500 font-normal">
												(
												{new Date(ach.date).toLocaleString("default", {
													month: "short",
													year: "numeric",
												})}
												)
											</span>
										)}
									</p>
									<p className="text-sm text-gray-600">{ach.description}</p>
								</div>

								{/* 3-Dot Menu */}
								<div className="relative">
									<MoreVertical
										className="cursor-pointer"
										onClick={() =>
											setAnchorIdx(index === anchorIdx ? null : index)
										}
									/>
									{anchorIdx === index && (
										<div className="absolute top-6 right-0 bg-white border rounded shadow-md z-10 w-32">
											<button
												className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
												onClick={() => {
													setSelectedAchievement(ach);
													setShowModal(true);
													setAnchorIdx(null);
												}}
											>
												Update
											</button>
											<button
												className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm text-red-600"
												onClick={() => handleDelete(ach._id)}
											>
												Delete
											</button>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-sm text-gray-500">No achievements added yet.</p>
				)}

				{/* View All / Show Less Toggle */}
				{data.achievements.length > 2 && (
					<div className="mt-4 text-right">
						<button
							className="text-sm text-blue-600 hover:underline"
							onClick={() => setShowAll((prev) => !prev)}
						>
							{showAll ? "Show Less" : "View All"}
						</button>
					</div>
				)}
			</div>

			<hr className="my-4" />

			{/* Current President */}
			<div>
				<h4 className="font-semibold">President</h4>

				{/* <p className="font-semibold">President:</p> */}
				<p className="text-blue-700 font-medium">{presidents.name || "N/A"}</p>
			</div>

			{/* Past Leaders */}
			<div className="mt-3">
				<h4 className="font-semibold">Past Leaders</h4>
				{/* {data?.pastLeaders?.map((leader, idx) => (
					<div
						key={idx}
						className="mt-1"
					>
						<p className="text-sm font-medium text-blue-600">
							{leader?.name} · {leader?.role}
						</p>
						<p className="text-xs text-gray-500">
							Tenure: {leader?.tenureStart} - {leader?.tenureEnd}
						</p>
					</div>
				))} */}
			</div>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
						<h2 className="text-lg font-semibold mb-4">Add Achievement</h2>
						<form
							onSubmit={handleAddAchievement}
							className="space-y-3"
						>
							<input
								type="text"
								name="title"
								placeholder="Title"
								value={newAchievement.title}
								onChange={handleChange}
								required
								className="w-full p-2 border rounded"
							/>
							<input
								type="text"
								name="description"
								placeholder="Description"
								value={newAchievement.description}
								onChange={handleChange}
								className="w-full p-2 border rounded"
							/>
							<input
								type="date"
								name="date"
								value={newAchievement.date}
								onChange={handleChange}
								className="w-full p-2 border rounded"
							/>
							<input
								type="file"
								name="image"
								accept="image/*"
								onChange={handleFileChange}
								className="w-full p-2 border rounded"
							/>

							<div className="flex justify-end gap-2">
								<button
									type="button"
									onClick={() => setShowModal(false)}
									className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
								>
									Submit
								</button>
							</div>
						</form>
						{/* Close X */}
						<button
							className="absolute top-2 right-3 text-gray-500 text-xl"
							onClick={() => setShowModal(false)}
						>
							×
						</button>
					</div>
				</div>
			)}

			{selectedImage && (
				<div
					className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
					onClick={() => setSelectedImage(null)} // close on background click
				>
					<div
						className="relative"
						onClick={(e) => e.stopPropagation()} // prevent close when clicking the image
					>
						<img
							src={selectedImage}
							alt="Enlarged"
							className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
						/>
						<button
							className="absolute top-2 right-2 text-white text-2xl font-bold"
							onClick={() => setSelectedImage(null)}
						>
							×
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ClubProfileCard;
