const express = require("express");
const router = express.Router();
const psychologistController = require("../../controller/psychologistController");
const { upload } = require("../../middlewares/multer");

router.post("/addPsychologist", psychologistController.addPsychologist);
router.get(
  "/allActivePsychologists",
  psychologistController.getAllActivePsychologist
);
router.get("/allPsychologist", psychologistController.getAllPsychologist);
router.get(
  "/psychologist/:id",
  psychologistController.getParticularPsychologist
);
router.post(
  "/deletePsychologist/:id",
  psychologistController.deletePsychologist
);
router.post(
  "/updatePsychologist/:id",
  psychologistController.updatePsychologist
);
router.post(
  "/completeProfile/:id",
  upload.array("files", 100),
  psychologistController.completeProfile
);

router.get("/getAppointments", psychologistController.getAppointments);
router.get("/checkAppointments", psychologistController.checkAppointments);
router.get("/joinsChecking/:id", psychologistController.joinsChecking);
router.get(
  "/searchPsychologist/:filter",
  psychologistController.searchPsychologist
);
router.get("/sortPsychologist/:sort", psychologistController.sortPsychologist);
router.post(
  "/paginatedPsychologist",
  psychologistController.paginatedPsychologist
);
router.post("/bookingAction/:bookingId", psychologistController.bookingAction);
router.get(
  "/viewAllAcceptedBookings",
  psychologistController.viewAllAcceptedBookings
);
router.get("/viewCanceledSession", psychologistController.viewCanceledSession);

module.exports = router;
