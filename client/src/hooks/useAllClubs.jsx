import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeAllClubs, setClubs } from "../store/slice/clubSlice";

const useAllClubs = () => {
	const dispatch = useDispatch();
	const clubs = useSelector((store) => store.cl.clubs);

	useEffect(() => {
		const fetchClubs = async () => {
			dispatch(removeAllClubs()); // Clear existing clubs before fetching
			try {
				const res = await axios.get("http://localhost:3002/faculty/clubs/list");
				if (res.data.success && Array.isArray(res.data.clubs)) {
					dispatch(setClubs(res.data.clubs));
				} else {
					console.warn("Invalid API response structure:", res.data);
				}
			} catch (error) {
				console.error("Error fetching club data:", error);
			}
		};

		fetchClubs();
	}, [dispatch]);

	// Separate useEffect to watch club updates
	useEffect(() => {
		console.log("✅ Clubs updated in Redux:", clubs);
	}, [clubs]);

	return clubs;
};

export default useAllClubs;
