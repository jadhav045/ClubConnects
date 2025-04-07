import { Bell } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../../../../hooks/useNotifications";

const NotificationBell = () => {
    const { notifications, markNotificationAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    console.log("Notifications:", notifications);

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button onClick={() => setIsOpen(!isOpen)} className="relative">
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-3 border border-gray-300">
                    <h4 className="text-lg font-semibold text-gray-700">Notifications</h4>
                    {notifications.length === 0 ? (
                        <p className="text-gray-500 text-sm">No notifications</p>
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif._id}
                                className={`p-2 my-1 rounded-md cursor-pointer transition-all ${
                                    notif.isRead ? "bg-gray-200" : "bg-blue-100"
                                }`}
                                onClick={() => markNotificationAsRead(notif._id)}
                            >
                                <p className="text-sm text-gray-800">{notif.message}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
