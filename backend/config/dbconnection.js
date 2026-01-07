const mongoose = require("mongoose");

// Define database URIs for each location
const locationDatabases = {
    becker: process.env.MONGODB_URI_BECKER || process.env.MONGODB_URI,
    tempe: process.env.MONGODB_URI_TEMPE || process.env.MONGODB_URI,
    downtown: process.env.MONGODB_URI_DOWNTOWN || process.env.MONGODB_URI,
    "north-scottsdale":
        process.env.MONGODB_URI_NORTH_SCOTTSDALE || process.env.MONGODB_URI,
};

// Store active connections
const connections = {};

/**
 * Get or create a connection to a specific location's database
 * @param {string} location - The location identifier (becker, tempe, downtown, north-scottsdale)
 * @returns {mongoose.Connection} - MongoDB connection for the location
 */
function getLocationConnection(location) {
    // If connection already exists and is ready, return it
    if (connections[location] && connections[location].readyState === 1) {
        return connections[location];
    }

    // Get the database URI for this location
    const dbUri = locationDatabases[location];

    if (!dbUri) {
        throw new Error(`No database URI configured for location: ${location}`);
    }

    // Create new connection
    const connection = mongoose.createConnection(dbUri);

    connection.on("connected", () => {
        console.log(`✅ Connected to ${location} database`);
    });

    connection.on("error", (err) => {
        console.error(`❌ Error connecting to ${location} database:`, err);
    });

    connection.on("disconnected", () => {
        console.log(`⚠️ Disconnected from ${location} database`);
    });

    // Store connection
    connections[location] = connection;

    return connection;
}

/**
 * Get the User model for a specific location
 * @param {string} location - The location identifier
 * @returns {mongoose.Model} - User model for that location
 */
function getUserModel(location) {
    const connection = getLocationConnection(location);

    // Check if model already exists on this connection
    if (connection.models.User) {
        return connection.models.User;
    }

    // Create User schema
    const userSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        isOwner: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            required: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    });

    return connection.model("User", userSchema);
}

/**
 * Get the Shift model for a specific location
 * @param {string} location - The location identifier
 * @returns {mongoose.Model} - Shift model for that location
 */
function getShiftModel(location) {
    const connection = getLocationConnection(location);

    // Check if model already exists on this connection
    if (connection.models.Shift) {
        return connection.models.Shift;
    }

    // Create Shift schema
    const shiftSchema = new mongoose.Schema({
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        employeeName: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: [
                "Server",
                "Cook",
                "Bartender",
                "Host",
                "Manager",
                "Dishwasher",
            ],
        },
        notes: {
            type: String,
            default: "",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    });

    // Index for efficient date queries
    shiftSchema.index({ date: 1 });

    return connection.model("Shift", shiftSchema);
}

/**
 * Close all database connections
 */
async function closeAllConnections() {
    const promises = Object.keys(connections).map((location) => {
        return connections[location].close();
    });
    await Promise.all(promises);
    console.log("✅ All database connections closed");
}

module.exports = {
    getLocationConnection,
    getUserModel,
    getShiftModel,
    closeAllConnections,
};
