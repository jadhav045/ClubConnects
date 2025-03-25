import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEvents } from "../store/slice/eventSlice";

const useAllEvents = () => {
	const dispatch = useDispatch();
	const { events } = useSelector((store) => store.event);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const res = await axios.get("http://localhost:3002/student/event/list");

				// console.log(res.data.events);
				if (res.data.success && Array.isArray(res.data.events)) {
					// console.log("Dispatching events to Redux:", res.data.events);
					dispatch(setEvents(res.data.events));
				} else {
					console.warn("Invalid API response structure:", res.data);
				}
			} catch (error) {
				console.error("Error fetching event data:", error);
			}
		};

		fetchEvents();
	}, [dispatch]);

	return events; // Return events if needed for components using this hook
};

export default useAllEvents;
