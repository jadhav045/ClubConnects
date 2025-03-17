import { useState, useEffect } from "react";

const useCountdown = (targetDate) => {
	const [timeLeft, setTimeLeft] = useState(targetDate - new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(targetDate - new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, [targetDate]);

	return new Date(timeLeft).toISOString().substr(11, 8); // Format as HH:MM:SS
};

export const formatEventDate = (dateTime) => {
	// Handle invalid or empty input
	if (!dateTime) {
		return {
			formattedDate: "Date TBA",
			formattedTime: "Time TBA",
		};
	}

	const date = new Date(dateTime);

	// Check if date is valid
	if (isNaN(date.getTime())) {
		return {
			formattedDate: "Invalid Date",
			formattedTime: "Invalid Time",
		};
	}

	// Format date as "Day, Month Date, Year"
	const formattedDate = date.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	// Format time as "HH:MM AM/PM"
	const formattedTime = date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	return {
		formattedDate,
		formattedTime,
	};
};

export default useCountdown;
