import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import { getPresidentClubId } from "../../hooks/getPresidantClubId";
import { getPresidentClub, getUser } from "../../routes/apiConfig";

export const useEventCard = (event) => {
	const [open, setOpen] = useState(false);
	const [tab, setTab] = useState(0);
	const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);
	const [isViewAppliedDialogOpen, setViewAppliedDialogOpen] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const openMenu = Boolean(anchorEl);

	const { user } = getUser();

	const presidentClubId = getPresidentClub();

	console.log("Pre", presidentClubId.clubId);
	console.log("ss", event?.organizer?._id);
	const isOrganizer = event?.organizer?._id === presidentClubId.clubId;

	console.log("is", isOrganizer);

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
		handleMenuClose();
		setShowForm(true);
	};

	const handleViewRegistrations = () => {
		handleMenuClose();
	};

	const handleViewFeedback = () => {
		handleMenuClose();
	};

	const handleShare = () => {
		console.log("eVENT", user);
		handleMenuClose();
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
