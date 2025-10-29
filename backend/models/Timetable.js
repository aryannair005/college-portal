const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  course: { type: String, required: true },
  semester: { type: String, required: true },
  section: { type: String, default: "A" }, // For different sections like A, B, C

  // Weekly schedule
  schedule: {
    monday: [
      {
        subject: { type: String, required: true },
        faculty: { type: String, required: true },
        timeSlot: { type: String, required: true }, // e.g., "09:00-10:00"
        room: { type: String, default: "" },
        type: {
          type: String,
          enum: ["lecture", "lab", "tutorial", "break"],
          default: "lecture",
        },
      },
    ],
    tuesday: [
      {
        subject: { type: String, required: true },
        faculty: { type: String, required: true },
        timeSlot: { type: String, required: true },
        room: { type: String, default: "" },
        type: {
          type: String,
          enum: ["lecture", "lab", "tutorial", "break"],
          default: "lecture",
        },
      },
    ],
    wednesday: [
      {
        subject: { type: String, required: true },
        faculty: { type: String, required: true },
        timeSlot: { type: String, required: true },
        room: { type: String, default: "" },
        type: {
          type: String,
          enum: ["lecture", "lab", "tutorial", "break"],
          default: "lecture",
        },
      },
    ],
    thursday: [
      {
        subject: { type: String, required: true },
        faculty: { type: String, required: true },
        timeSlot: { type: String, required: true },
        room: { type: String, default: "" },
        type: {
          type: String,
          enum: ["lecture", "lab", "tutorial", "break"],
          default: "lecture",
        },
      },
    ],
    friday: [
      {
        subject: { type: String, required: true },
        faculty: { type: String, required: true },
        timeSlot: { type: String, required: true },
        room: { type: String, default: "" },
        type: {
          type: String,
          enum: ["lecture", "lab", "tutorial", "break"],
          default: "lecture",
        },
      },
    ],
    saturday: [
      {
        subject: { type: String, required: true },
        faculty: { type: String, required: true },
        timeSlot: { type: String, required: true },
        room: { type: String, default: "" },
        type: {
          type: String,
          enum: ["lecture", "lab", "tutorial", "break"],
          default: "lecture",
        },
      },
    ],
  },

  // Metadata
  academicYear: { type: String, required: true }, // e.g., "2024-25"
  isActive: { type: Boolean, default: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdByName: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // Additional info
  effectiveFrom: { type: Date, required: true },
  effectiveTo: { type: Date },
  description: { type: String, default: "" },
});

// Update the updatedAt field before saving
timetableSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
timetableSchema.index({ course: 1, semester: 1, section: 1, academicYear: 1 });

module.exports = mongoose.model("Timetable", timetableSchema);
