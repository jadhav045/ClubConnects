import { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
	updateDiscussion,
	deleteDiscussion,
} from "../../../store/slice/discussSlice";

export const useDiscussion = (discussion, currentUser) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(discussion?.title);
	const [editedDescription, setEditedDescription] = useState(
		discussion?.description
	);
	const [newComment, setNewComment] = useState("");
	const [replyingTo, setReplyingTo] = useState(null);
	const [replyText, setReplyText] = useState("");

	// Add this to check if current user has appreciated
	const hasAppreciated = useMemo(() => {
		return discussion?.appreciations?.some(
			(userId) => userId === currentUser?._id
		);
	}, [discussion?.appreciations, currentUser?._id]);

	const handleEditClick = useCallback(() => {
		setEditedTitle(discussion.title);
		setEditedDescription(discussion.description);
		setIsEditing(true);
	}, [discussion]);

	const handleError = useCallback((error) => {
		console.error("Error:", error);
		toast.error(error.response?.data?.message || "Something went wrong");
		setIsLoading(false);
	}, []);

	const handleAppreciate = useCallback(async () => {
		try {
			console.log(currentUser?._id === discussion.createdBy._id);
			console.log("curr", currentUser?._id);
			console.log("discused", discussion.createdBy);
			setIsLoading(true);
			const token = localStorage.getItem("token");
			const response = await axios.put(
				`http://localhost:3002/discussions/${discussion._id}/appreciate`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			// Update Redux store with new appreciations
			dispatch(
				updateDiscussion({
					...discussion,
					appreciations: response.data.appreciations,
				})
			);

			// Show appropriate message
			toast.success(
				hasAppreciated ? "Appreciation removed" : "Discussion appreciated"
			);
		} catch (error) {
			handleError(error);
		} finally {
			setIsLoading(false);
		}
	}, [discussion, dispatch, handleError, hasAppreciated]);

	const handleUpdate = useCallback(async () => {
		if (!editedTitle.trim() || !editedDescription.trim()) {
			toast.error("Title and description are required");
			return;
		}

		try {
			setIsLoading(true);
			const token = localStorage.getItem("token");
			const response = await axios.put(
				`http://localhost:3002/discussions/${discussion._id}`,
				{
					title: editedTitle,
					description: editedDescription,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				setIsEditing(false);
				// Update Redux store
				dispatch(updateDiscussion(response.data.discussion));
				toast.success("Discussion updated successfully");
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to update discussion"
			);
		} finally {
			setIsLoading(false);
		}
	}, [discussion._id, editedTitle, editedDescription, dispatch]);

	const handleDelete = useCallback(async () => {
		if (!window.confirm("Are you sure you want to delete this discussion?"))
			return;

		try {
			setIsLoading(true);
			const token = localStorage.getItem("token");
			await axios.delete(
				`http://localhost:3002/discussions/${discussion._id}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			// Update Redux store
			dispatch(deleteDiscussion(discussion._id));
			toast.success("Discussion deleted successfully");
		} catch (error) {
			handleError(error);
		} finally {
			setIsLoading(false);
		}
	}, [discussion._id, handleError, dispatch]);

	return {
		isLoading,
		showComments,
		setShowComments,
		isEditing,
		setIsEditing,
		editedTitle,
		setEditedTitle,
		editedDescription,
		setEditedDescription,
		newComment,
		setNewComment,
		replyingTo,
		setReplyingTo,
		replyText,
		setReplyText,
		handleAppreciate,
		handleUpdate,
		handleDelete,
		handleEditClick,
		hasAppreciated,
	};
};
