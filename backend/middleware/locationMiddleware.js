const jwt = require("jsonwebtoken");

// Valid locations
const VALID_LOCATIONS = ["becker", "tempe", "downtown", "north-scottsdale"];

/**
 * Middleware to extract location from request
 * Location can come from:
 * 1. Request body (for POST requests)
 * 2. Query parameter (for GET requests)
 * 3. JWT token (if user is authenticated)
 */
function extractLocation(req, res, next) {
    let location = req.body.location || req.query.location;

    // If no location in request, try to get from JWT token
    if (!location) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                location = decoded.location;
            } catch (err) {
                // Token invalid or expired, will be caught by authenticateToken middleware
            }
        }
    }

    // Validate location
    if (!location) {
        return res.status(400).json({
            success: false,
            message: "Location is required",
        });
    }

    if (!VALID_LOCATIONS.includes(location)) {
        return res.status(400).json({
            success: false,
            message: "Invalid location",
        });
    }

    // Attach location to request object
    req.location = location;
    next();
}

/**
 * Middleware to verify JWT token and extract user info
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token required",
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Invalid token",
            });
        }
        req.user = user;
        // Also set location from token if not already set
        if (!req.location && user.location) {
            req.location = user.location;
        }
        next();
    });
}

module.exports = {
    extractLocation,
    authenticateToken,
    VALID_LOCATIONS,
};
