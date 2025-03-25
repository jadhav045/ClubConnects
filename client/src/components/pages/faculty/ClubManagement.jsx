import { useState, useEffect } from "react";
import axios from "axios";
import CreateClub from "../../form/CreateClub";
import { X, Search, Users, Plus } from "lucide-react";
import { useSelector } from "react-redux";

const ClubManagement = () => {
	// const [clubs, setClubs] = useState([]);

	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [isCreateClubOpen, setIsCreateClubOpen] = useState(false);

	const { clubs } = useSelector((store) => store.club);

	const filteredClubs = clubs.filter((club) =>
		club?.clubName.toLowerCase().includes(search.toLowerCase())
	);

	useEffect(() => {
		if (clubs.length > 0) {
			setLoading(false);
		}
	}, [clubs]);
	
	return (
		<div className="max-w-7xl mx-auto p-6">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Club Management</h1>
					<p className="text-gray-600 mt-2">
						Manage student organizations and activities
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
					<div className="relative flex-1">
						<input
							type="text"
							placeholder="Search clubs..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
						<Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
					</div>

					<button
						onClick={() => setIsCreateClubOpen(true)}
						className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 justify-center"
					>
						<Plus className="w-5 h-5" />
						Create Club
					</button>
				</div>
			</div>

			{/* Loading State */}
			{loading ? (
				<div className="flex justify-center items-center h-40">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
				</div>
			) : (
				/* Club Grid */
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredClubs.map((club) => (
						<div
							key={club._id}
							className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
						>
							<div className="p-6">
								<div className="flex items-start justify-between mb-4">
									<div>
										<h2 className="text-xl font-semibold text-gray-900">
											{club.clubName}
										</h2>
										<p className="text-sm text-gray-600 mt-1">
											{club.shortName}
										</p>
									</div>
									<span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
										{club.status}
									</span>
								</div>

								<p className="text-gray-600 text-sm mb-4 line-clamp-3">
									{club.description}
								</p>

								<div className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-2 text-gray-500">
										<Users className="w-4 h-4" />
										<span>{club.members?.length || 0} Members</span>
									</div>
									<div className="space-x-3">
										<button className="text-blue-600 hover:text-blue-800 font-medium">
											View Requests
										</button>
										<button className="text-gray-600 hover:text-gray-800">
											Edit
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Create Club Modal */}
			{isCreateClubOpen && (
				<div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative flex flex-col max-h-[90vh]">
						{/* Modal Header */}
						<div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
							<h2 className="text-2xl font-bold text-gray-900">
								Create New Club
							</h2>
							<button
								onClick={() => {
									setIsCreateClubOpen(false);
									fetchClubs();
								}}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X className="w-6 h-6 text-gray-600" />
							</button>
						</div>

						{/* Modal Content - Scrollable Area */}
						<div className="overflow-y-auto flex-1">
							<CreateClub onClose={() => setIsCreateClubOpen(false)} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ClubManagement;
