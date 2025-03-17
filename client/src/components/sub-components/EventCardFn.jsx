import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getPresidentClubId } from "../../hooks/getPresidantClubId";

export const useEventCard = (event) => {
	const [open, setOpen] = useState(false);
	const [tab, setTab] = useState(0);
	const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);
	const [isViewAppliedDialogOpen, setViewAppliedDialogOpen] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const openMenu = Boolean(anchorEl);

	const { user } = useSelector((store) => store.auth);
	const presidentClubId = getPresidentClubId(user);
	const isOrganizer = event?.organizer === presidentClubId;

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const handleTabChange = (event, newValue) => setTab(newValue);

	const handleClick = () => {
		if (user.role === "Student") {
			setRegisterDialogOpen(true);
		} else if (user.role === "Faculty" || user.role === "Alumni") {
			setViewAppliedDialogOpen(true);
		} else {
			window.open(event?.registerLink, "_blank");
		}
	};

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleCreateForm = () => {
		console.log("Creating FOrm");
		console.log("Create registration form for", event._id);
		handleMenuClose();
		setShowForm(true);
	};

	const handleViewRegistrations = () => {
		handleMenuClose();
		console.log("View registrations for", event._id);
	};

	const handleViewFeedback = () => {
		handleMenuClose();
		console.log("View feedback for", event._id);
	};

	const handleShare = () => {
		handleMenuClose();
		console.log("Share event", event._id);
	};

	const handleRegister = (data) => {
		console.log("Student Registered:", data);
		alert("Registered Successfully!");
	};

	const useCountdown = (countdownTime) => {
		const [timeLeft, setTimeLeft] = useState("Loading...");
		// console.log(countdownTime);
		useEffect(() => {
			const timer = setInterval(() => {
				const eventDate = new Date(countdownTime);
				const now = new Date();
				const diff = eventDate - now;

				if (diff <= 0) {
					setTimeLeft("Event Started!");
					clearInterval(timer);
				} else {
					const hours = Math.floor(diff / (1000 * 60 * 60));
					const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
					setTimeLeft(`${hours}h ${minutes}m left`);
				}
			}, 1000);

			return () => clearInterval(timer);
		}, [countdownTime]);

		return timeLeft;
	};

	return {
		open,
		tab,
		isRegisterDialogOpen,
		isViewAppliedDialogOpen,
		showForm,
		anchorEl,
		openMenu,
		isOrganizer,
		user,
		handleOpen,
		handleClose,
		handleTabChange,
		handleClick,
		handleMenuClick,
		handleMenuClose,
		handleCreateForm,
		handleViewRegistrations,
		handleViewFeedback,
		handleShare,
		handleRegister,
		useCountdown,
		setRegisterDialogOpen,
		setViewAppliedDialogOpen,
	};
};
