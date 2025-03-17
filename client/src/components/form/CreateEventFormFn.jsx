import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setEvents } from "../../store/slice/eventSlice";
import { setUserClub } from "../../store/slice/authSlice";
import { getPresidentClubId } from "../../hooks/getPresidantClubId";

export const useCreateEventForm = (onSuccess) => {
	const dispatch = useDispatch();

	const { user, userClub } = useSelector((store) => store.auth);
	const { events } = useSelector((store) => store.event);

	const [formData, setFormData] = useState({
		title: "",
		eventType: "",
		description: "",
		detailedDescription: "",
		eventDateTime: "",
		location: "",
		organizer: "67c9fc043e56002ddf7300c8",
		requestUniqueId: "wtss",
		registerLink: "",
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

	const handleSubmit = async (eventId) => {
		try {
			await axios.post("your-endpoint", formData);
			onSuccess?.();
			onClose?.();
		} catch (error) {
			console.error("Submission failed:", error);
		}
	};

	return {
		formData,
		handleChange: (e) =>
			setFormData({ ...formData, [e.target.name]: e.target.value }),
		handleSubmit,
		setFormData,
	};
};
