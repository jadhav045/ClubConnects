import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { removePost } from "../../store/slice/postSlice";

export const usePostCard = (post, currentUser, onPostDeleted) => {
	const { posts } = useSelector((store) => store.post);

	const [showOptions, setShowOptions] = useState(false);
	const [likes, setLikes] = useState(post?.likes?.length || 0);
	const [liked, setLiked] = useState(post?.likes?.includes(currentUser?._id));
	const [comments, setComments] = useState(post?.comments || []);
	const [newComment, setNewComment] = useState("");
	const [isSubmittingComment, setIsSubmittingComment] = useState(false);
	const [replyingTo, setReplyingTo] = useState(null);
	const [replyText, setReplyText] = useState("");
	const [isSubmittingReply, setIsSubmittingReply] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const dispatch = useDispatch();

	// Check if post is liked on mount
	useEffect(() => {
		if (post?.likes && currentUser?._id) {
			setLiked(post.likes.includes(currentUser._id));
			setLikes(post.likes.length);
		}
	}, [post?.likes, currentUser?._id]);

	// Toggle Like with API call and socket
	const handleLike = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				toast.error("Please login to like posts");
				return;
			}

			// Optimistic update
			setLiked(!liked);
			setLikes((prev) => (liked ? prev - 1 : prev + 1));

			const response = await axios.put(
				`http://localhost:3002/post/${post?._id}/like`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.success) {
				// Update was successful
				toast.success(response.data.message);
			} else {
				// Revert optimistic update if failed
				setLiked(liked);
				setLikes(likes);
			}
		} catch (error) {
			console.error("Error toggling like:", error);
			toast.error(error.response?.data?.message || "Failed to update like");
			// Revert optimistic update
			setLiked(liked);
			setLikes(likes);
		}
	};

	// Toggle 3-dot menu
	const toggleOptions = () => {
		setShowOptions(!showOptions);
	};

	// Handle adding a comment
	const handleAddComment = async () => {
		if (!newComment.trim()) {
			toast.warning("Comment cannot be empty");
			return;
		}

		if (!currentUser) {
			toast.error("Please login to comment");
			return;
		}

		try {
			setIsSubmittingComment(true);
			const token = localStorage.getItem("token");
			if (!token) throw new Error("No token found");

			const response = await axios.post(
				`http://localhost:3002/post/${post?._id}/comment`,
				{ text: newComment.trim() },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (response.data.success) {
				// Add new comment to state with user details
				setComments((prevComments) => [
					...prevComments,
					{
						userId: currentUser._id,
						text: newComment.trim(),
						timestamp: new Date(),
						user: {
							_id: currentUser._id,
							fullName: currentUser.fullName,
							profilePicture: currentUser.profilePicture,
						},
					},
				]);

				// Clear input
				setNewComment("");
				toast.success("Comment added successfully");
			}
		} catch (error) {
			console.error("Error adding comment:", error);
			toast.error(error.response?.data?.message || "Failed to add comment");
		} finally {
			setIsSubmittingComment(false);
		}
	};

	// Handle deleting a comment
	const handleDeleteComment = async (commentId) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) throw new Error("No token found");

			const response = await axios.delete(
				`http://localhost:3002/post/${post?._id}/comment/${commentId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (response.data.success) {
				setComments((prevComments) =>
					prevComments.filter((comment) => comment._id !== commentId)
				);
				toast.success("Comment deleted successfully");
			}
		} catch (error) {
			console.error("Error deleting comment:", error);
			toast.error(error.response?.data?.message || "Failed to delete comment");
		}
	};

	// Handle adding a reply
	const handleReply = async (commentId) => {
		if (!replyText.trim()) {
			toast.warning("Reply cannot be empty");
			return;
		}

		if (!currentUser) {
			toast.error("Please login to reply");
			return;
		}

		try {
			setIsSubmittingReply(true);
			const token = localStorage.getItem("token");
			if (!token) throw new Error("No token found");

			const response = await axios.post(
				`http://localhost:3002/post/${post?._id}/comment/${commentId}/reply`,
				{ text: replyText.trim() },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (response.data.success) {
				setComments((prevComments) =>
					prevComments.map((comment) =>
						comment._id === commentId
							? {
									...comment,
									replies: [
										...(comment.replies || []),
										{
											_id: response.data.reply._id,
											userId: currentUser._id,
											text: replyText.trim(),
											timestamp: new Date(),
											user: {
												_id: currentUser._id,
												fullName: currentUser.fullName,
												profilePicture: currentUser.profilePicture,
											},
										},
									],
							  }
							: comment
					)
				);

				// Clear input
				setReplyText("");
				setReplyingTo(null);
				toast.success("Reply added successfully");
			}
		} catch (error) {
			console.error("Error adding reply:", error);
			toast.error(error.response?.data?.message || "Failed to add reply");
		} finally {
			setIsSubmittingReply(false);
		}
	};

	// Handle deleting a reply
	const handleDeleteReply = async (commentId, replyId) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) throw new Error("No token found");

			const response = await axios.delete(
				`http://localhost:3002/post/${post?._id}/comment/${commentId}/reply/${replyId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (response.data.success) {
				setComments((prevComments) =>
					prevComments.map((comment) =>
						comment._id === commentId
							? {
									...comment,
									replies: comment.replies.filter(
										(reply) => reply._id !== replyId
									),
							  }
							: comment
					)
				);
				toast.success("Reply deleted successfully");
			}
		} catch (error) {
			console.error("Error deleting reply:", error);
			toast.error(error.response?.data?.message || "Failed to delete reply");
		}
	};

	const handleSavePost = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				toast.error("Please login to save posts");
				return;
			}

			const response = await axios.put(
				`http://localhost:3002/post/save/${post?._id}/${post?.clubId || ""}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setIsSaved(!isSaved);
			toast.success(response.data.message);
		} catch (error) {
			console.error("Error saving post:", error);
			toast.error(error.response?.data?.message || "Failed to save post");
			// Revert optimistic update
			setIsSaved(isSaved);
		}
	};

	const handleDeletePost = async () => {
		try {
			if (!window.confirm("Are you sure you want to delete this post?")) {
				return;
			}

			setIsDeleting(true);
			const token = localStorage.getItem("token");

			if (!token) {
				toast.error("Authentication required");
				return;
			}

			const config = {
				headers: { Authorization: `Bearer ${token}` },
				data: { clubId: post?.clubId }, // Include clubId in request body
			};

			const response = await axios.delete(
				`http://localhost:3002/post/${post?._id}`,
				config
			);

			if (response.data.message) {
				dispatch(removePost(post._id));
				toast.success(response.data.message);

				if (onPostDeleted) onPostDeleted(post?._id);
			}
		} catch (error) {
			console.error("Error deleting post:", error);
			toast.error(error.response?.data?.message || "Failed to delete post");
		} finally {
			setIsDeleting(false);
		}
	};
	return {
		// States
		showOptions,
		likes,
		liked,
		comments,
		newComment,
		isSubmittingComment,
		replyingTo,
		replyText,
		isSubmittingReply,

		// Setters
		setShowOptions,
		setNewComment,
		setReplyingTo,
		setReplyText,

		// Handlers
		handleLike,
		toggleOptions,
		handleAddComment,
		handleDeleteComment,
		handleReply,
		handleDeleteReply,

		isSaved,
		handleSavePost,
		isDeleting,
		handleDeletePost,
	};
};
