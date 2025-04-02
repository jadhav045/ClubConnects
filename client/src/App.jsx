import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";

import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import NotFound from "./auth/NotFound";
import Login from "./auth/Login";
import Register from "./auth/Register";

import AdminRoutes from "./routes/AdminRoutes";
import AlumniRoutes from "./routes/AlumniRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import FacultyRoutes from "./routes/FacultyRoutes";
import ClubRoutes from "./routes/ClubRoutes";


const theme = createTheme();

const App = () => {
	const { user, token } = useSelector((state) => state.auth);


	return (
		<ThemeProvider theme={theme}>
			<ToastContainer />
			<BrowserRouter>
				<Routes>
					{/* Public Routes */}
					<Route
						path="/login"
						element={<Login />}
					/>
					<Route
						path="/register"
						element={<Register />}
					/>

					{/* Protected Routes */}
					{[
						{ path: "admin", roles: ["admin"], Component: AdminRoutes },
						{ path: "alumni", roles: ["alumni"], Component: AlumniRoutes },
						{ path: "club", roles: ["club"], Component: ClubRoutes },
						{ path: "faculty", roles: ["faculty"], Component: FacultyRoutes },
						{ path: "student", roles: ["student"], Component: StudentRoutes },
					].map(({ path, roles, Component }) => (
						<Route
							key={path}
							path={`/${path}`}
							element={
								<ProtectedRoute allowedRoles={roles}>
									<Dashboard />
								</ProtectedRoute>
							}
						>
							{Component()}
						</Route>
					))}

					{/* Not Found Route */}
					<Route
						path="*"
						element={<NotFound />}
					/>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
