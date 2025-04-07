
import { useSocket } from "../../../../config/socket";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Notification = () => {
    const { notifications } = useSocket();
    const [latestNotification, setLatestNotification] = useState(null);

    useEffect(() => {
        if (notifications.length > 0) {
            setLatestNotification(notifications[notifications.length - 1]);
            
            
            const timer = setTimeout(() => {
                setLatestNotification(null);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [notifications]);

    if (!latestNotification) return null;

    return (
        <motion.div 
            className="fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <p className="font-semibold">New Notification</p>
            <p>{latestNotification.message}</p>
        </motion.div>
    );
};

export default Notification;
