const router = require("express").Router();

const psychologistRoutes = require("./psychologist/psychologistRoute");
const adminRoutes = require("./admin/userRoute");
const settingRoute = require("./settings/settingRoute");

router.use("/admin", adminRoutes);
router.use("/psychologist", psychologistRoutes);
router.use("/settings", settingRoute);

module.exports = router;
