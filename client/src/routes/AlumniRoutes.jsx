import { Route } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import CommonRoutes from "./CommonRoutes";
import AlumniNetwork from "../components/pages/alumni/AlumniNetwork";
import Mentorship from "../components/pages/alumni/Mentorship";
const AlumniRoutes = () => {
	return (
		<Route
			path="/alumni"
			element={<Dashboard />}
		>
			{CommonRoutes()}

			<Route
				path="network"
				element={<AlumniNetwork />}
			/>
			<Route
				path="mentorship"
				element={<Mentorship />}
			/>
		</Route>
	);
};

export default AlumniRoutes;
