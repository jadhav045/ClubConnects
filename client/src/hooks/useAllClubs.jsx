import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClubs } from "../store/slice/clubSlice";
import axios from "axios";

const useAllClubs = () => {
	const dispatch = useDispatch();
	const { clubs } = useSelector((store) => store.club);

	useEffect(() => {
		const fetchClubs = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) return;

				const res = await axios.get("http://localhost:3002/faculty/clubs/list");

				console.log(res.data.clubs);
				dispatch(setClubs(res.data.clubs));
			} catch (error) {
				console.error("Error fetching posts", error);
			}
		};

		fetchClubs();
	}, [dispatch]);
};

export default useAllClubs;
