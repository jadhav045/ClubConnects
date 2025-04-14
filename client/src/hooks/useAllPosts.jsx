import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../store/slice/postSlice";

const useAllPosts = () => {
	const dispatch = useDispatch();
	const posts = useSelector((store) => store.post.posts); // Get posts from Redux

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) return; // If no token, return early

				const res = await axios.get("http://localhost:3002/post", {
					headers: { Authorization: `Bearer ${token}` },
				});

				dispatch(setPosts(res.data.posts)); // Update Redux store
			} catch (error) {
				console.error("Error fetching posts:", error);
			}
		};

		fetchPosts();
	}, [dispatch]); // Depend only on dispatch to avoid infinite loops

	return posts; // Return the posts so components can use them
};

export default useAllPosts;
