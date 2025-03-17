import { useState } from "react";
import axios from "axios";

const AssignRole = ({ facultyId }) => {
	const [userId, setUserId] = useState("");
	const [clubId, setClubId] = useState("");
	const [role, setRole] = useState("Supporter");
	const [message, setMessage] = useState("");

	const roles = [
		"Club Mentor",
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`http://localhost:3002/faculty/assignRoles/${facultyId}`,
				{
					userId,
					clubId,
					role,
				}
			);
			setMessage(response.data.message || "Role assigned successfully!");
		} catch (error) {
			setMessage(error.response?.data?.message || "Failed to assign role");
		}
	};

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Assign Role to Club Member</h2>
			<form
				onSubmit={handleSubmit}
				className="space-y-4"
			>
				<input
					type="text"
					placeholder="User ID"
					value={userId}
					onChange={(e) => setUserId(e.target.value)}
					className="input input-bordered w-full"
					required
				/>
				<input
					type="text"
					placeholder="Club ID"
					value={clubId}
					onChange={(e) => setClubId(e.target.value)}
					className="input input-bordered w-full"
					required
				/>
				<select
					value={role}
					onChange={(e) => setRole(e.target.value)}
					className="select select-bordered w-full"
				>
					{roles.map((role, index) => (
						<option
							key={index}
							value={role}
						>
							{role}
						</option>
					))}
				</select>
				<button
					type="submit"
					className="btn btn-primary"
				>
					Assign Role
				</button>
				{message && <p className="mt-4 text-info">{message}</p>}
			</form>
		</div>
	);
};

export default AssignRole;
