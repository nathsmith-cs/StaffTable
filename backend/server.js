// 1. Import packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// 2. Initialize Express
const app = express();

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err));

// 5. Import and use routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// 6. Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
