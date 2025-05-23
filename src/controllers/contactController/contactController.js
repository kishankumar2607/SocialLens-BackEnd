const Contact = require("../../models/contactModel/contactModel");

exports.addContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.validate();
    await newContact.save();

    res.status(201).json({ message: "Contact added successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = {};
      for (const key in error.errors) {
        let customErrorMessage = "Validation error";
        if (key === "FirstName") {
          customErrorMessage = "Invalid First Name";
        } else if (key === "LastName") {
          customErrorMessage = "Invalid Last Name";
        } else if (key === "Email") {
          customErrorMessage = "Invalid Email";
        } else if (key === "Mobile") {
          customErrorMessage = "Invalid Mobile";
        } else if (key === "Message") {
          customErrorMessage = "Invalid Message";
        }
        validationErrors[key] = customErrorMessage;
      }
      return res.status(400).json({ errors: validationErrors });
    }

    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteAllContacts = async (req, res) => {
  try {
    // Check if there are contacts available
    const contactsCount = await Contact.countDocuments();

    if (contactsCount === 0) {
      return res.status(404).json({ message: "No contacts found to delete" });
    }

    // Delete all contacts
    const result = await Contact.deleteMany({});

    console.log(`${result.deletedCount} contacts deleted.`);
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteContactById = async (req, res) => {
  try {
    const contactId = req.params.id;

    // Check if the contact exists
    const existingContact = await Contact.findById(contactId);
    if (!existingContact) {
      return res.status(404).json({ error: "Data not found" });
    }

    // Delete the contact by ID
    const result = await Contact.findByIdAndDelete(contactId);

    console.log(`${result.deletedCount} contact deleted.`);
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
