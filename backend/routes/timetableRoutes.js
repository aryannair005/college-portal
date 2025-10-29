const express = require("express");
const router = express.Router();
const { ensureStudent, ensureAdmin } = require("../middleware/authMiddleware");
const timetableController = require("../controllers/timetableController");
const validate = require("../middleware/validationMiddleware");

// === STUDENT ROUTES ===
router.get("/", ensureStudent, timetableController.getTimetablePage);
router.get("/:id", ensureStudent, timetableController.getTimetableDetail);

// === ADMIN ROUTES ===
router.get(
  "/admin/manage",
  ensureAdmin,
  timetableController.getAdminTimetablePage,
);
router.get("/admin/add", ensureAdmin, timetableController.getAddTimetablePage);
router.post(
  "/admin/add",
  ensureAdmin,
  validate("addTimetableSchema"),
  timetableController.postAddTimetable,
);
router.get(
  "/admin/edit/:id",
  ensureAdmin,
  timetableController.getEditTimetablePage,
);
router.post(
  "/admin/edit/:id",
  ensureAdmin,
  validate("editTimetableSchema"),
  timetableController.postEditTimetable,
);
router.post(
  "/admin/delete/:id",
  ensureAdmin,
  timetableController.deleteTimetable,
);
router.post(
  "/admin/toggle/:id",
  ensureAdmin,
  timetableController.toggleTimetableStatus,
);
router.post("/admin/copy/:id", ensureAdmin, timetableController.copyTimetable);

module.exports = router;
