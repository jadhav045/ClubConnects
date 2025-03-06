import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		prn: "",
		role: "",
		password: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:3002/auth/register",
				formData
			);
			toast.success(response.data.message);
			console.log(response.data);
			navigate("/login"); // Navigate to login after successful registration
		} catch (error) {
			console.error(
				"Registration failed:",
				error.response?.data || error.message
			);
			toast.error(error.response?.data.message || "Registration failed");
		}
	};

	return (
		<div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
			<h2 className="text-2xl mb-4">Register</h2>
			<form
				onSubmit={handleSubmit}
				className="space-y-4"
			>
				<input
					type="text"
					name="fullName"
					placeholder="Full Name"
					value={formData.fullName}
					onChange={handleChange}
					className="w-full p-2 border rounded"
					required
				/>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={formData.email}
					onChange={handleChange}
					className="w-full p-2 border rounded"
					required
				/>
				<input
					type="text"
					name="prn"
					placeholder="PRN"
					value={formData.prn}
					onChange={handleChange}
					className="w-full p-2 border rounded"
					required
				/>
				<input
					type="text"
					name="role"
					placeholder="Role (e.g., student, alumni)"
					value={formData.role}
					onChange={handleChange}
					className="w-full p-2 border rounded"
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={formData.password}
					onChange={handleChange}
					className="w-full p-2 border rounded"
					required
				/>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
				>
					Register
				</button>
			</form>
			<div className="mt-4 text-center">
				<p>
					Already have an account?
					<button
						onClick={() => navigate("/login")}
						className="text-blue-500 hover:underline"
					>
						Login
					</button>
				</p>
			</div>
		</div>
	);
};

export default Register;
