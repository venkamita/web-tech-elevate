import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
	try {
		const header = req.headers.authorization || "";
		const token = header.startsWith("Bearer ") ? header.slice(7) : null;
		if (!token) return res.status(401).json({ message: "Missing token" });
		const payload = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
		req.userId = payload.id;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" });
	}
}


