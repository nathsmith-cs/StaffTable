const mongoose = require("mongoose");

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
        enum: ["Server", "Busser"],
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

module.exports = mongoose.model("Shift", shiftSchema);
