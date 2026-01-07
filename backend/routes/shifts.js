const express = require("express");
const router = express.Router();
const { getShiftModel } = require("../config/dbconnection");
const { authenticateToken } = require("../middleware/locationMiddleware");

// All shift routes require authentication
// The authenticateToken middleware extracts location from the JWT token

// GET shifts for a date range (week view)
router.get("/week", authenticateToken, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const location = req.location;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required",
            });
        }

        // Get Shift model for this location
        const Shift = getShiftModel(location);

        const shifts = await Shift.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        }).sort({ date: 1, startTime: 1 });

        res.json({
            success: true,
            shifts,
        });
    } catch (error) {
        console.error("Error fetching shifts:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// GET shifts for a specific date
router.get("/date/:date", authenticateToken, async (req, res) => {
    try {
        const { date } = req.params;
        const location = req.location;

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Get Shift model for this location
        const Shift = getShiftModel(location);

        const shifts = await Shift.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        }).sort({ startTime: 1 });

        res.json({
            success: true,
            shifts,
        });
    } catch (error) {
        console.error("Error fetching shifts:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// CREATE a new shift
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { date, startTime, endTime, employeeName, role, notes } =
            req.body;
        const location = req.location;

        // Validation
        if (!date || !startTime || !endTime || !employeeName || !role) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // Get Shift model for this location
        const Shift = getShiftModel(location);

        const shift = new Shift({
            date: new Date(date),
            startTime,
            endTime,
            employeeName,
            role,
            notes: notes || "",
            createdBy: req.user.userId,
        });

        await shift.save();

        res.status(201).json({
            success: true,
            message: "Shift created successfully",
            shift,
        });
    } catch (error) {
        console.error("Error creating shift:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// UPDATE a shift
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { date, startTime, endTime, employeeName, role, notes } =
            req.body;
        const location = req.location;

        // Get Shift model for this location
        const Shift = getShiftModel(location);

        const shift = await Shift.findById(id);

        if (!shift) {
            return res.status(404).json({
                success: false,
                message: "Shift not found",
            });
        }

        // Update fields
        if (date) shift.date = new Date(date);
        if (startTime) shift.startTime = startTime;
        if (endTime) shift.endTime = endTime;
        if (employeeName) shift.employeeName = employeeName;
        if (role) shift.role = role;
        if (notes !== undefined) shift.notes = notes;

        await shift.save();

        res.json({
            success: true,
            message: "Shift updated successfully",
            shift,
        });
    } catch (error) {
        console.error("Error updating shift:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// DELETE a shift
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const location = req.location;

        // Get Shift model for this location
        const Shift = getShiftModel(location);

        const shift = await Shift.findByIdAndDelete(id);

        if (!shift) {
            return res.status(404).json({
                success: false,
                message: "Shift not found",
            });
        }

        res.json({
            success: true,
            message: "Shift deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting shift:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

module.exports = router;
