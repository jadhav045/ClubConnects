import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";

import { setDiscusss } from "../store/slice/discussSlice";
const useAllDiscussions = () => {
	const dispatch = useDispatch();
	const { discusss } = useSelector((store) => store.discuss);
	useEffect(() => {
		const fetchDiscussions = async () => {
			try {
				console.log("useDiscussion");
				const token = localStorage.getItem("token");
				if (!token) return;
				const res = await axios.get("http://localhost:3002/discussions");
				// console.log("API Response:", res.data.discussions);

				if (!Array.isArray(res.data.discussions)) {
					console.error(
						"Error: API response is not an array",
						res.data.discussions
					);
					return;
				}

				console.log("e", res.data.discussions);
				dispatch(setDiscusss(res.data.discussions)); // ✅ Corrected
			} catch (error) {
				console.error("Error fetching discussions", error);
			}
		};

		fetchDiscussions();
	}, [dispatch]);

	// ✅ This logs the updated state correctly
	useEffect(() => {
		console.log("Updated discussions:", discusss);
	}, [discusss]);

	return discusss; // ✅ Return discussions if needed
};

export default useAllDiscussions;
