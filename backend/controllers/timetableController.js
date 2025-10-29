const Timetable = require("../models/Timetable");

// === STUDENT FUNCTIONS ===

exports.getTimetablePage = async (req, res) => {
  try {
    const { course, semester, section } = req.query;
    let filter = { isActive: true };

    if (course) filter.course = new RegExp(course, "i");
    if (semester) filter.semester = semester;
    if (section) filter.section = section;

    const timetables = await Timetable.find(filter)
      .sort({ effectiveFrom: -1 })
      .populate("createdBy", "username");

    // Get current timetable (most recent active one)
    const currentTimetable = timetables.length > 0 ? timetables[0] : null;

    // Get unique values for filters
    const allTimetables = await Timetable.find({ isActive: true });
    const courses = [...new Set(allTimetables.map((t) => t.course))];
    const semesters = [...new Set(allTimetables.map((t) => t.semester))].sort();
    const sections = [...new Set(allTimetables.map((t) => t.section))].sort();

    res.render("timetable", {
      title: "Class Timetable",
      currentTimetable,
      timetables,
      filters: { course, semester, section },
      courses,
      semesters,
      sections,
    });
  } catch (error) {
    console.error("Error loading timetable:", error);
    req.session.messages = ["Error loading timetable"];
    res.render("timetable", {
      title: "Class Timetable",
      currentTimetable: null,
      timetables: [],
      filters: {},
      courses: [],
      semesters: [],
      sections: [],
    });
  }
};

exports.getTimetableDetail = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id).populate(
      "createdBy",
      "username",
    );

    if (!timetable) {
      req.session.messages = ["Timetable not found"];
      return res.redirect("/timetable");
    }

    // For students, only show active timetables
    if (req.session.userRole !== "admin" && !timetable.isActive) {
      req.session.messages = ["Timetable not available"];
      return res.redirect("/timetable");
    }

    res.render("timetable-detail", {
      title: "Timetable Details",
      timetable,
    });
  } catch (error) {
    console.error("Error loading timetable detail:", error);
    req.session.messages = ["Error loading timetable"];
    res.redirect("/timetable");
  }
};

// === ADMIN FUNCTIONS ===

exports.getAdminTimetablePage = async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "username");

    res.render("admin/manage-timetable", {
      title: "Manage Timetables",
      timetables,
    });
  } catch (error) {
    console.error("Error loading timetables for admin:", error);
    req.session.messages = ["Error loading timetables"];
    res.render("admin/manage-timetable", {
      title: "Manage Timetables",
      timetables: [],
    });
  }
};

exports.getAddTimetablePage = (req, res) => {
  res.render("admin/add-timetable", { title: "Add Timetable" });
};

exports.postAddTimetable = async (req, res) => {
  try {
    const {
      course,
      semester,
      section,
      academicYear,
      effectiveFrom,
      effectiveTo,
      description,
      schedule,
    } = req.body;

    // Parse schedule data from form
    const parsedSchedule = {};
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    days.forEach((day) => {
      parsedSchedule[day] = [];
      if (schedule[day] && Array.isArray(schedule[day])) {
        schedule[day].forEach((slot) => {
          if (slot.subject && slot.faculty && slot.timeSlot) {
            parsedSchedule[day].push({
              subject: slot.subject.trim(),
              faculty: slot.faculty.trim(),
              timeSlot: slot.timeSlot.trim(),
              room: slot.room ? slot.room.trim() : "",
              type: slot.type || "lecture",
            });
          }
        });
      }
    });

    const timetable = new Timetable({
      course,
      semester,
      section: section || "A",
      academicYear,
      effectiveFrom: new Date(effectiveFrom),
      effectiveTo: effectiveTo ? new Date(effectiveTo) : null,
      description: description || "",
      schedule: parsedSchedule,
      createdBy: req.session.userId,
      createdByName: req.session.username,
    });

    await timetable.save();
    req.session.messages = ["Timetable added successfully"];
    res.redirect("/admin/timetable");
  } catch (error) {
    console.error("Error adding timetable:", error);
    req.session.messages = ["Error adding timetable"];
    res.redirect("/admin/timetable/add");
  }
};

exports.getEditTimetablePage = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      req.session.messages = ["Timetable not found"];
      return res.redirect("/admin/timetable");
    }

    res.render("admin/edit-timetable", {
      title: "Edit Timetable",
      timetable,
    });
  } catch (error) {
    console.error("Error loading timetable for edit:", error);
    req.session.messages = ["Error loading timetable"];
    res.redirect("/admin/timetable");
  }
};

exports.postEditTimetable = async (req, res) => {
  try {
    const {
      course,
      semester,
      section,
      academicYear,
      effectiveFrom,
      effectiveTo,
      description,
      schedule,
    } = req.body;

    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      req.session.messages = ["Timetable not found"];
      return res.redirect("/admin/timetable");
    }

    // Parse schedule data from form
    const parsedSchedule = {};
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    days.forEach((day) => {
      parsedSchedule[day] = [];
      if (schedule[day] && Array.isArray(schedule[day])) {
        schedule[day].forEach((slot) => {
          if (slot.subject && slot.faculty && slot.timeSlot) {
            parsedSchedule[day].push({
              subject: slot.subject.trim(),
              faculty: slot.faculty.trim(),
              timeSlot: slot.timeSlot.trim(),
              room: slot.room ? slot.room.trim() : "",
              type: slot.type || "lecture",
            });
          }
        });
      }
    });

    timetable.course = course;
    timetable.semester = semester;
    timetable.section = section || "A";
    timetable.academicYear = academicYear;
    timetable.effectiveFrom = new Date(effectiveFrom);
    timetable.effectiveTo = effectiveTo ? new Date(effectiveTo) : null;
    timetable.description = description || "";
    timetable.schedule = parsedSchedule;
    timetable.updatedAt = Date.now();

    await timetable.save();
    req.session.messages = ["Timetable updated successfully"];
    res.redirect("/admin/timetable");
  } catch (error) {
    console.error("Error updating timetable:", error);
    req.session.messages = ["Error updating timetable"];
    res.redirect("/admin/timetable");
  }
};

exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      req.session.messages = ["Timetable not found"];
      return res.redirect("/admin/timetable");
    }

    await Timetable.findByIdAndDelete(req.params.id);
    req.session.messages = ["Timetable deleted successfully"];
    res.redirect("/admin/timetable");
  } catch (error) {
    console.error("Error deleting timetable:", error);
    req.session.messages = ["Error deleting timetable"];
    res.redirect("/admin/timetable");
  }
};

exports.toggleTimetableStatus = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      req.session.messages = ["Timetable not found"];
      return res.redirect("/admin/timetable");
    }

    timetable.isActive = !timetable.isActive;
    await timetable.save();

    req.session.messages = [
      `Timetable ${timetable.isActive ? "activated" : "deactivated"} successfully`,
    ];
    res.redirect("/admin/timetable");
  } catch (error) {
    console.error("Error toggling timetable status:", error);
    req.session.messages = ["Error updating timetable status"];
    res.redirect("/admin/timetable");
  }
};

exports.copyTimetable = async (req, res) => {
  try {
    const originalTimetable = await Timetable.findById(req.params.id);

    if (!originalTimetable) {
      req.session.messages = ["Timetable not found"];
      return res.redirect("/admin/timetable");
    }

    const newTimetable = new Timetable({
      course: originalTimetable.course,
      semester: originalTimetable.semester,
      section: originalTimetable.section,
      academicYear: originalTimetable.academicYear,
      schedule: originalTimetable.schedule,
      effectiveFrom: new Date(),
      description: `Copy of ${originalTimetable.description}`,
      createdBy: req.session.userId,
      createdByName: req.session.username,
      isActive: false, // Set as inactive by default
    });

    await newTimetable.save();
    req.session.messages = [
      "Timetable copied successfully. Please edit and activate it.",
    ];
    res.redirect(`/admin/timetable/edit/${newTimetable._id}`);
  } catch (error) {
    console.error("Error copying timetable:", error);
    req.session.messages = ["Error copying timetable"];
    res.redirect("/admin/timetable");
  }
};
