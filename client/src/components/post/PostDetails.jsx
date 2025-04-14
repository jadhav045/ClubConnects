import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL, getUser } from "../../routes/apiConfig";
import PostCard from "./PostCard";

const PostDetails = () => {
	const { postId } = useParams();
	const location = useLocation();
	const [post, setPost] = useState(location.state?.postData || null);
	const [loading, setLoading] = useState(!location.state?.postData);
	const [error, setError] = useState(null);

	const user = getUser();
	useEffect(() => {
		if (!post) {
			// Fetch post if data is not available in state
			const fetchPost = async () => {
				try {
					const response = await axios.get(`${API_URL}/post/${postId}`);
					setPost(response.data);
				} catch (err) {
					setError("Error fetching post details");
				} finally {
					setLoading(false);
				}
			};

			fetchPost();
		}
	}, [post, postId]);

	if (loading) return <p>Loading post...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<PostCard
			post={post}
			currentUser={user}
		/>
	);
};
export default PostDetails;
