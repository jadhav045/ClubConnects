import { useEffect, useState, useRef } from "react";
import { useSocket } from "../../../../config/socket";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../../../routes/apiConfig";

const Notifications = () => {
	const { notifications } = useSocket();
	const [showNotifications, setShowNotifications] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [hasNewNotification, setHasNewNotification] = useState(false);
	const prevNotificationsLength = useRef(0);
	const user = getUser();
	const navigate = useNavigate();
	useEffect(() => {
		if (notifications.length > prevNotificationsLength.current) {
			const latestNotification = notifications[notifications.length - 1];
			setToastMessage(latestNotification.message);
			setShowToast(true);
			setHasNewNotification(true);

			const timer = setTimeout(() => {
				setShowToast(false);
			}, 5000);

			prevNotificationsLength.current = notifications.length;
			return () => clearTimeout(timer);
		}
	}, [notifications]);

	const handleNotificationClick = () => {
		setShowNotifications(!showNotifications);
		setHasNewNotification(false);
	};

	return (
		<div className="relative mr-5">
			<button
				className="relative p-2 bg-transparent border-none cursor-pointer"
				onClick={handleNotificationClick}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
					<path d="M13.73 21a2 2 0 0 1-3.46 0" />
				</svg>
				{notifications.length > 0 && (
					<span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
						{notifications.length}
					</span>
				)}
				{hasNewNotification && (
					<span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full px-1">
						+
					</span>
				)}
			</button>

			{showNotifications && (
				<div className="absolute right-0 top-full bg-white border border-gray-300 rounded-md shadow-lg w-72 max-h-96 overflow-y-auto mt-2 z-50">
					<h3 className="p-4 border-b border-gray-200 text-lg font-semibold">
						Notifications ({notifications.length})
					</h3>
					{notifications.length === 0 ? (
						<div className="p-4 text-center text-gray-500">
							No notifications
						</div>
					) : (
						notifications.map((notification, index) => (
							<div
								key={index}
								className="p-4 border-b border-gray-200 text-sm cursor-pointer hover:bg-gray-100"
								onClick={() =>
									navigate(`/${user.role}/post/${notification.postId}`)
								} // Navigate to the post
							>
								{notification.message}
							</div>
						))
					)}
				</div>
			)}

			{showToast && (
				<div className="fixed bottom-5 right-5 bg-gray-800 text-white px-6 py-3 rounded-md shadow-md animate-slideIn">
					<div className="flex items-center gap-2">
						<strong>New notification:</strong> {toastMessage}
					</div>
				</div>
			)}
		</div>
	);
};

export default Notifications;
