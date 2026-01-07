const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserModel } = require("../config/dbconnection");
const { extractLocation } = require("../middleware/locationMiddleware");

// REGISTER route (create new user)
router.post("/register", extractLocation, async (req, res) => {
    try {
        const { email, password, isOwner, name } = req.body;
        const location = req.location;

        // Get User model for this location
        const User = getUserModel(location);

        // Check if user already exists in this location's database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists at this location",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            email,
            password: hashedPassword,
            isOwner: isOwner || false,
            name: name || "",
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// LOGIN route (check credentials)
router.post("/login", extractLocation, async (req, res) => {
    try {
        const { email, password } = req.body;
        const location = req.location;

        // Get User model for this location
        const User = getUserModel(location);

        // Find user by email in this location's database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Create JWT token (include location and isOwner in the token payload)
        const token = jwt.sign(
            {
                userId: user._id,
                location: location,
                isOwner: user.isOwner,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                isOwner: user.isOwner,
                location: location,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

module.exports = router;
