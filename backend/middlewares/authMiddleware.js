const { auth } = require("../config/firebaseConfig");

/**
 * ✅ Verify Firebase Token Middleware
 */
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
        return res.status(401).json({ error: "Authorization token is required." });
    }

    

    try {
        const decodedToken = await auth.verifyIdToken(token);
        
        req.user = decodedToken;  // ✅ Attaching decoded user data
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

module.exports = { verifyToken };