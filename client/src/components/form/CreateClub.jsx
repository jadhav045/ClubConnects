import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
// import { Search, User, Mail, X } from "lucide-react";
import {
	Search,
	User,
	Mail,
	X,
	BookOpen,
	Users,
	Tag,
	Type,
} from "lucide-react";
const CreateClub = () => {
	const { user } = useSelector((store) => store.auth); // Corrected import
	const [formData, setFormData] = useState({
		clubName: "",
		shortName: "",
		motto: "",
		description: "",
		collegeId: user?.profileId?.college,
		presidentId: "",
		foundingYear: "",
	});

	const [search, setSearch] = useState(""); // Search input for president
	const [users, setUsers] = useState([]); // Store searched users
	const [selectedPresident, setSelectedPresident] = useState(null); // Selected president

	// const facultyId = ;

	// Handle form input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Fetch users based on search input
	useEffect(() => {
		const fetchUsers = async () => {
			if (!search) return setUsers([]);
			try {
				const { data } = await axios.get(
					`http://localhost:3002/admin/users/list?search=${search}`
				);
				setUsers(data.users);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		fetchUsers();
	}, [search]);

	// Select a president from the list
	const handleSelectPresident = (user) => {
		setSelectedPresident(user);
		setFormData({ ...formData, presidentId: user._id });
		setSearch(""); // Clear search after selection
		setUsers([]); // Clear dropdown
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`http://localhost:3002/faculty/create/club/${user._id}`,
				formData
			);
			toast.success(response.data.message);
			setFormData({
				clubName: "",
				shortName: "",
				motto: "",
				description: "",
				presidentId: "",
				foundingYear: "",
			});
			setSelectedPresident(null);
		} catch (error) {
			console.error("Error creating club:", error);
			toast.error(
				error.response?.data?.message ||
					"Failed to create club. Please try again."
			);
		}
	};
	return (
		<div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
			{/* Header Section */}
			<div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
				{/* Header Section */}
				<div className="mb-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-blue-100 rounded-lg">
							<Users className="w-5 h-5 text-blue-600" />
						</div>
						<div>
							<h1 className="text-xl font-bold text-gray-900">
								Register New Club
							</h1>
							<p className="text-sm text-gray-500">
								Organize student activities
							</p>
						</div>
					</div>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-6"
				>
					{/* Club Information Section */}
					<section className="space-y-4">
						<div className="flex items-center gap-2 mb-3">
							<BookOpen className="w-5 h-5 text-gray-500" />
							<h2 className="font-semibold text-gray-800">Club Details</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-1">
								<LabelWithIcon
									icon={<Type className="w-4 h-4" />}
									text="Official Name"
									required
								/>
								<InputField
									name="clubName"
									value={formData.clubName}
									onChange={handleChange}
								/>
							</div>

							<div className="space-y-1">
								<LabelWithIcon
									icon={<Tag className="w-4 h-4" />}
									text="Short Code"
								/>
								<InputField
									name="shortName"
									value={formData.shortName}
									onChange={handleChange}
								/>
							</div>

							<div className="md:col-span-2 space-y-1">
								<LabelWithIcon
									icon={<BookOpen className="w-4 h-4" />}
									text="Motto"
								/>
								<InputField
									name="motto"
									value={formData.motto}
									onChange={handleChange}
								/>
							</div>

							<div className="md:col-span-2 space-y-1">
								<LabelWithIcon
									icon={<Mail className="w-4 h-4" />}
									text="FoundingYear"
								/>
								<InputField
									name="motto"
									value={formData.foundingYear}
									onChange={handleChange}
								/>
							</div>
							<div className="md:col-span-2 space-y-1">
								<LabelWithIcon
									icon={<Mail className="w-4 h-4" />}
									text="Description"
								/>
								<textarea
									name="description"
									value={formData.description}
									onChange={handleChange}
									rows="3"
									className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
								/>
							</div>
						</div>
					</section>

					{/* Leadership Section */}
					<section className="space-y-4">
						<div className="flex items-center gap-2 mb-3">
							<User className="w-5 h-5 text-gray-500" />
							<h2 className="font-semibold text-gray-800">Leadership</h2>
						</div>

						<div className="space-y-2">
							<div className="space-y-1">
								<LabelWithIcon
									icon={<Search className="w-4 h-4" />}
									text="Assign President"
									required
								/>
								<div className="relative">
									<div className="flex items-center border rounded-lg focus-within:ring-1 focus-within:ring-blue-500">
										<Search className="w-4 h-4 text-gray-400 ml-3" />
										<input
											type="text"
											value={search}
											onChange={(e) => setSearch(e.target.value)}
											placeholder="Search faculty..."
											className="w-full px-3 py-2 rounded-lg border-none text-sm"
										/>
									</div>

									{users.length > 0 && (
										<ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-sm max-h-48 overflow-auto">
											{users.map((user) => (
												<li
													key={user._id}
													onClick={() => handleSelectPresident(user)}
													className="p-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-2"
												>
													<User className="w-4 h-4 text-gray-500" />
													<div>
														<p className="font-medium">{user.name}</p>
														<p className="text-gray-500 text-xs">
															{user.email}
														</p>
													</div>
												</li>
											))}
										</ul>
									)}
								</div>
							</div>

							{selectedPresident && (
								<div className="p-2 bg-green-50 rounded-lg border border-green-200 flex items-center justify-between text-sm">
									<div className="flex items-center gap-2">
										<User className="w-4 h-4 text-green-600" />
										<span>{selectedPresident.name}</span>
										<span className="text-gray-500 text-xs">
											{selectedPresident.email}
										</span>
									</div>
									<X
										className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer"
										onClick={() => {
											setSelectedPresident(null);
											setFormData({ ...formData, presidentId: "" });
										}}
									/>
								</div>
							)}
						</div>
					</section>

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-colors"
					>
						Create Club
					</button>
				</form>
			</div>
		</div>
	);
};

// Reusable Components
const LabelWithIcon = ({ icon, text, required }) => (
	<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
		<span className="text-gray-400">{icon}</span>
		{text}
		{required && <span className="text-red-500">*</span>}
	</div>
);

const InputField = ({ name, value, onChange, placeholder, required }) => (
	<input
		name={name}
		value={value}
		onChange={onChange}
		placeholder={placeholder}
		required={required}
		className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder-gray-400"
	/>
);

export default CreateClub;
