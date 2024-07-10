const express = require("express");
const router = express.Router();
const settingsController = require("../../controller/settingsControllers");
const { createSetting } = require("../../middlewares/settingsValidations");

router.post("/addSetting", createSetting, settingsController.addSettings);
router.post("/update1Settings/:id", settingsController.update1Settings);
router.get("/getSettings/:type", settingsController.getSettings);
router.post("/deleteSettings/:setting_id", settingsController.deleteSettings);

module.exports = router;
