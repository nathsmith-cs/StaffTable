const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const shiftRoutes = require("./routes/shifts");

const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL || "https://stafftables.onrender.com",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(express.json());

// Multi-location database is configured in dbConnection.js
console.log("✅ Multi-location database configuration loaded");

app.use("/api/auth", authRoutes);
app.use("/api/shifts", shiftRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "Server is running!" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong on the server!",
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
