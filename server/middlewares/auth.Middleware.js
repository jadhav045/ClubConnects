import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
	// console.log("At Middle");
	const token =
		req.cookies.token || req.headers["authorization"]?.split(" ")[1];
	// console.log("Received Token:", token);

	if (!token) {
		return res
			.status(401)
			.json({ message: "Access denied. No token provided." });
	}

	try {
		const decoded = jwt.decode(token, { complete: true });
		// console.log("Decoded Token:", decoded);/

		if (!decoded || !decoded.payload.exp) {
			return res.status(403).json({ message: "Invalid token format." });
		}

		const expiryTime = new Date(decoded.payload.exp * 1000);
		// console.log("Token Expiry Time:", expiryTime);

		jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
			if (err) {
				console.error("JWT Verification Error:", err.message);
				return res.status(403).json({ message: "Invalid or expired token." });
			}

			req.user = verified;
			next();
		});
	} catch (error) {
		console.error("Unexpected Error in Token Handling:", error);
		return res.status(500).json({ message: "Internal Server Error." });
	}
};
