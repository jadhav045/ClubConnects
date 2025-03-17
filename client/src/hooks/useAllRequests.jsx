import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRequests } from "../store/slice/requestSlice";

const useAllRequests = () => {
	const dispatch = useDispatch();
	const { requests } = useSelector((store) => store.request);

	useEffect(() => {
		const fetchRequests = async () => {
			console.log("We are in useAllReques");
			try {
				const res = await axios.get(
					`http://localhost:3002/faculty/request/list`
				);
				if (res.data.success) {
					dispatch(setRequests(res.data.requests));
				}
				console.log(requests);
			} catch (error) {
				console.error("Error fetching request data:", {
					message: error.message,
					code: error.code,
					config: error.config,
					response: error.response,
				});
			}
		};

		fetchRequests();
	}, [dispatch]); // Only runs once when the component mounts
};

export default useAllRequests;
