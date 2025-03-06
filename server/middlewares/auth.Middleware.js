import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
	const token =
		req.cookies.token || req.headers["authorization"]?.split(" ")[1];

	if (!token) {
		return res
			.status(401)
			.json({ message: "Access denied. No token provided." });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).json({ message: "Invalid or expired token." });
		}
		req.user = decoded;
		next();
	});
};

// Let me know if you’d like me to add token expiration handling or anything else! 🚀
