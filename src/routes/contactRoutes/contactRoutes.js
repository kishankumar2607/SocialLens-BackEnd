const express = require("express");
const router = express.Router();
const ContactController = require("../../controllers/contactController/contactController");

// Contact Routes
router.post("/contact-form", ContactController.postContact);
router.get("/contacts", ContactController.getAllContact);
router.delete("/contacts/:id", ContactController.deleteContactById);

module.exports = router;
