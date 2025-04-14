// roleMiddleware.js
export const roleMiddleware = (roles) => {
	return (req, res, next) => {
		// console.log(req.user);
		console.log(roles);
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ message: "Access denied." });
		}
		next();
	};
};
