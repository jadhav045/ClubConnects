import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../store/slice/authSlice";

const Login = () => {
	const [formData, setFormData] = useState({
		emailOrPrn: "",
		password: "",
	});
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:3002/auth/login",
				formData
			);

			toast.success(response.data.message);

			// Store token in localStorage (IMPORTANT)
			localStorage.setItem("token", response.data.token);

			// Save user details in Redux state
			dispatch(setAuthUser(response.data.user));

			if (response.data.success) {
				const role = response.data.user.role;
				console.log(response.data.user);
				navigate(`/${role.toLowerCase()}`);
			}
		} catch (error) {
			console.error("Login failed:", error.response?.data || error.message);
			toast.error(error.response?.data.message || "Login failed");
		}
	};

	const handleCreateAccount = () => {
		navigate("/register"); // Navigate to register page
	};

	return (
		<div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
			<h2 className="text-2xl mb-4">Login</h2>
			<form
				onSubmit={handleSubmit}
				className="space-y-4"
			>
				<input
					type="text"
					name="emailOrPrn"
					placeholder="Email or PRN"
					value={formData.emailOrPrn}
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
					Login
				</button>
			</form>
			<div className="mt-4 text-center">
				<p>
					Don't have an account?
					<button
						onClick={handleCreateAccount}
						className="text-blue-500 hover:underline"
					>
						Create Account
					</button>
				</p>
			</div>
		</div>
	);
};

export default Login;
