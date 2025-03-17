import { useState, useEffect } from "react";
import axios from "axios";
import CreateClub from "../../form/CreateClub";
import AssignRole from "../../form/AssignRole";

const ClubManagement = () => {
	const [clubs, setClubs] = useState([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [isCreateClubOpen, setIsCreateClubOpen] = useState(false);

	useEffect(() => {
		fetchClubs();
	}, []);

	const facultyId = "67c9f49d5563ae44383c1f33";
	const fetchClubs = async () => {
		try {
			console.log(facultyId);
			const response = await axios.get(
				`http://localhost:3002/faculty/clubs/${facultyId}`
			);
			setClubs(response.data.data);
		} catch (error) {
			console.error("Error fetching clubs:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (e) => {
		setSearch(e.target.value);
	};

	const filteredClubs = clubs.filter((club) =>
		club.name.toLowerCase().includes(search.toLowerCase())
	);

	const handleCreateClub = () => {
		setIsCreateClubOpen(true);
	};

	const handleCloseModal = () => {
		setIsCreateClubOpen(false);
		fetchClubs(); // Refresh the club list after creation
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Club Management</h1>
			<div className="flex justify-between mb-6">
				<input
					type="text"
					placeholder="Search clubs..."
					value={search}
					onChange={handleSearch}
					className="input input-bordered w-full max-w-xs"
				/>
				<button
					className="btn btn-primary"
					onClick={handleCreateClub}
				>
					Create New Club
				</button>
			</div>

			{loading ? (
				<p>Loading clubs...</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{filteredClubs.map((club) => (
						<div
							key={club._id}
							className="card bg-base-100 shadow-xl p-4"
						>
							<h2 className="text-xl font-semibold">{club.name}</h2>
							<p>Status: {club.status}</p>
							<div className="mt-4 flex justify-between">
								<button className="btn btn-outline">View Requests</button>
								<button className="btn btn-secondary">Edit Club</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Create Club Modal */}
			{isCreateClubOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative">
						<button
							className="btn btn-sm btn-circle absolute top-2 right-2"
							onClick={handleCloseModal}
						>
							✕
						</button>
						<CreateClub onClose={handleCloseModal} />
						<div className="flex justify-end mt-4">
							<button
								className="btn btn-secondary mr-2"
								onClick={handleCloseModal}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			<AssignRole />
		</div>
	);
};

export default ClubManagement;
