const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const shiftRoutes = require("./routes/shifts");

const app = express();

// UPDATED CORS SECTION - REPLACES app.use(cors());
const allowedOrigins = [
    "http://localhost:3000",
    "https://your-frontend-name.onrender.com", // Update after deploying frontend
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, Postman, etc)
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
// END OF UPDATED CORS SECTION

app.use(express.json());

mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/stafftable")
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

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
