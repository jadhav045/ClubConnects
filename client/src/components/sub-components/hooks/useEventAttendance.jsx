import { useState, useEffect } from "react";
import { useAttendance } from "../EventCard/useAttendance";

export const useEventAttendance = (event, userId) => {
	const [hasGivenAttendance, setHasGivenAttendance] = useState(false);
	const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
	const { openAttendance, markAttendance, isLoading } = useAttendance(
		event._id
	);
	

	useEffect(() => {
		if (event?.attendance && userId) {
			const hasAttended = event.attendance.some(
				(record) => record.user === userId
			);
			setHasGivenAttendance(hasAttended);
		}
	}, [event, userId]);

	const handleGenerateAttendanceCode = async ({ code, duration }) => {
		try {
			await openAttendance(code, duration);
			alert("Attendance opened successfully!");
			setShowAttendanceDialog(false);
		} catch (error) {
			alert(error.response?.data?.message || "Failed to open attendance");
		}
	};

	const handleSubmitAttendanceCode = async (code) => {
		try {
			await markAttendance(code);
			setHasGivenAttendance(true);
			alert("Attendance marked successfully!");
			setShowAttendanceDialog(false);
		} catch (error) {
			alert(error.response?.data?.message || "Failed to mark attendance");
		}
	};

	return {
		hasGivenAttendance,
		showAttendanceDialog,
		setShowAttendanceDialog,
		handleGenerateAttendanceCode,
		handleSubmitAttendanceCode,
		isLoading,
	};
};
