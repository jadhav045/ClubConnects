import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setEvents } from "../../store/slice/eventSlice";
import { setUserClub } from "../../store/slice/authSlice";
import { getPresidentClubId } from "../../hooks/getPresidantClubId";

export const useCreateEventForm = (onSuccess, onClose) => {
	const dispatch = useDispatch();

	const { user } = useSelector((store) => store.auth);
	const organizerId = getPresidentClubId(user);
	// console.log(organizerId);
	const [formData, setFormData] = useState({
		title: "",
		eventType: "",
		description: "",
		detailedDescription: "",
		eventDateTime: "",
		location: "",
		organizer: organizerId || "",
		registrationDeadline: "",
		schedule: [],
		resources: [],
	});

	useEffect(() => {
		if (user) {
			const presidentClubId = getPresidentClubId(user);
			dispatch(setUserClub(presidentClubId));
		}
	}, [user, dispatch]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const { events } = useSelector((store) => store.event);
	const handleSubmit = async () => {
		try {
			console.log("Submitting Form Data:", formData);

			const res = await axios.post(
				"http://localhost:3002/student/event/create",
				formData
			);

			if (res.data.success) {
				console.log("from backend",res.data.event)
				dispatch(setEvents([...events, res.data.event]));
				toast.success("Event created successfully! 🎉");
			
				// dispatch(setEvents(...prev, res.data.event));

				setFormData({
					title: "",
					eventType: "",
					description: "",
					detailedDescription: "",
					eventDateTime: "",
					location: "",
					organizer: organizerId || "",
					registrationDeadline: "",
					schedule: [],
					resources: [],
				});

				if (onSuccess) onSuccess();
				if (onClose) onClose();
			} else {
				throw new Error(res.data.message || "Event creation failed");
			}
		} catch (error) {
			console.error("Submission failed:", error);
			toast.error(error.response?.data?.message || "Failed to create event!");
		}
	};

	return {
		formData,
		handleChange,
		handleSubmit,
		setFormData,
	};
};
