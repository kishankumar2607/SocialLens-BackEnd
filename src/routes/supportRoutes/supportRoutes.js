const express = require("express");
const router = express.Router();
const SupportController = require("../../controllers/supportController/supportController");

router.post("/support-form", SupportController.postSupport);
router.get("/supports", SupportController.getAllSupport);
router.delete("/support/:id", SupportController.deleteSupportById);

module.exports = router;
