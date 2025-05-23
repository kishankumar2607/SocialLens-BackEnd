const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contactController/contactController');

router.post('/contact-form', contactController.addContact);
router.get("/contacts", contactController.getAllContacts);
router.delete("/delete-all-contacts", contactController.deleteAllContacts);
router.delete("/contacts/:id", contactController.deleteContactById);

module.exports = router;