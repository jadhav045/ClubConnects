import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { User, Search, ShieldCheck, X, Users } from "lucide-react";

const AddClubMember = ({ clubId, clubName }) => {
	const { user } = useSelector((store) => store.auth);
	const [search, setSearch] = useState("");
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [role, setRole] = useState("");

	const CLUB_ROLES = [
		"Admin",
		"President",
		"Vice President",
		"Secretary",
		"Treasurer",
		"Event Coordinator",
		"Marketing Officer",
		"Content Manager",
		"Member Relations Officer",
		"Supporter",
	];

	useEffect(() => {
		const fetchUsers = async () => {
			if (!search.trim()) return setUsers([]);
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

	const handleSelectUser = (u) => {
		setSelectedUser(u);
		setSearch("");
		setUsers([]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedUser || !role) {
			return toast.error("Please select both user and role.");
		}
		try {
			const response = await axios.post(
				`http://localhost:3002/student/assign-role/`,
				{
					userId: selectedUser._id,
					role,
					clubId,
				}
			);
			toast.success(response.data.message);
			setSelectedUser(null);
			setRole("");
		} catch (error) {
			console.error(error);
			toast.error(error.response?.data?.message || "Failed to add member.");
		}
	};

	return (
		<div className="max-w-xl mx-auto mt-10 bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-6">
			<div className="flex items-center gap-3">
				<div className="p-2 bg-blue-100 rounded-full">
					<Users className="w-5 h-5 text-blue-600" />
				</div>
				<div>
					<p className="text-sm text-gray-500">
						Find a user and assign them a role
					</p>
				</div>
			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-6"
			>
				{/* Search Field */}
				<div className="space-y-2">
					<LabelWithIcon
						icon={<Search className="w-4 h-4" />}
						text="Search User"
						required
					/>
					<div className="relative">
						<div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
							<Search className="w-4 h-4 text-gray-400 mr-2" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search by name or email"
								className="w-full bg-transparent text-sm outline-none"
							/>
						</div>

						{users.length > 0 && (
							<ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-y-auto">
								{users.map((u) => (
									<li
										key={u._id}
										onClick={() => handleSelectUser(u)}
										className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-start gap-2"
									>
										<User className="w-4 h-4 text-gray-500 mt-1" />
										<div>
											<p className="text-sm font-medium text-gray-800">
												{u.name}
											</p>
											<p className="text-xs text-gray-500">{u.email}</p>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				{/* Selected User */}
				{selectedUser && (
					<div className="flex items-center justify-between px-4 py-2 border border-blue-200 bg-blue-50 rounded-md text-sm">
						<div className="flex items-center gap-2">
							<User className="w-4 h-4 text-blue-600" />
							<span className="font-medium text-gray-800">
								{selectedUser.name}
							</span>
							<span className="text-xs text-gray-500">
								{selectedUser.email}
							</span>
						</div>
						<X
							className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer"
							onClick={() => {
								setSelectedUser(null);
								setRole("");
							}}
						/>
					</div>
				)}

				{/* Role Selection */}
				<div className="space-y-2">
					<LabelWithIcon
						icon={<ShieldCheck className="w-4 h-4" />}
						text="Assign Role"
						required
					/>
					<select
						value={role}
						onChange={(e) => setRole(e.target.value)}
						className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
					>
						<option value="">Select a role</option>
						{CLUB_ROLES.map((r) => (
							<option
								key={r}
								value={r}
							>
								{r}
							</option>
						))}
					</select>
				</div>

				<button
					type="submit"
					className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-700 transition duration-200"
				>
					Add Member
				</button>
			</form>
		</div>
	);
};

const LabelWithIcon = ({ icon, text, required }) => (
	<label className="flex items-center gap-2 text-sm font-medium text-gray-700">
		<span className="text-gray-400">{icon}</span>
		{text}
		{required && <span className="text-red-500">*</span>}
	</label>
);

export default AddClubMember;
