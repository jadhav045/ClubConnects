
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import AdminRoutes from "./routes/AdminRoutes";
import AlumniRoutes from "./routes/AlumniRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import FacultyRoutes from "./routes/FacultyRoutes";
import ClubRoutes from "./routes/ClubRoutes";
import NotFound from "./auth/NotFound";

import Login from "./auth/Login";
import Register from "./auth/Register";
import { ToastContainer } from "react-toastify";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

function App() {
	return (
		<>
			<ThemeProvider theme={theme}>
				<ToastContainer />
				<BrowserRouter>
					<Routes>
						<Route
							path="/login"
							element={<Login isLogin={true} />}
						/>
						<Route
							path="/register"
							element={<Register isLogin={false} />}
						/>

						<Route
							path="/admin"
							element={
								<ProtectedRoute allowedRoles={["admin"]}>
									<Dashboard />
								</ProtectedRoute>
							}
						>
							{AdminRoutes()}
						</Route>

						<Route
							path="/alumni"
							element={
								<ProtectedRoute allowedRoles={["alumni"]}>
									<Dashboard />
								</ProtectedRoute>
							}
						>
							{AlumniRoutes()}
						</Route>

						<Route
							path="/club"
							element={
								<ProtectedRoute allowedRoles={["club"]}>
									<Dashboard />
								</ProtectedRoute>
							}
						>
							{ClubRoutes()}
						</Route>
						<Route
							path="/faculty"
							element={
								<ProtectedRoute allowedRoles={["faculty"]}>
									<Dashboard />
								</ProtectedRoute>
							}
						>
							{FacultyRoutes()}
						</Route>
						<Route
							path="/student"
							element={
								<ProtectedRoute allowedRoles={["student"]}>
									<Dashboard />
								</ProtectedRoute>
							}
						>
							{StudentRoutes()}
						</Route>
						<Route
							path="*"
							element={<NotFound />}
						/>
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</>
	);
}
export default App;
