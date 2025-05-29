const Contact = require("../../models/contactModel/contactModel");
const contactEmailService = require("../../helper/contactEmailService");

exports.postContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.validate();
    await newContact.save();

    // await contactEmailService.sendEmailToYourself(newContact);
    await contactEmailService.sendConfirmationEmail(newContact);

    res.status(201).json({ message: "Contact added successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = {};

      for (const key in error.errors) {
        let customerErrorMessage = "Validation Error";

        if ((key = "FullName")) {
          customerErrorMessage = "Name is required";
        } else if ((key = "Email")) {
          customerErrorMessage = "Email is required";
        } else if ((key = "Message")) {
          customerErrorMessage = "Message is required";
        }
        validationErrors[key] = customerErrorMessage;
      }
      return res.status(400).json({ errors: validationErrors });
    }
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllContact = async (req, res) => {
  try {
    const getContact = await Contact.find();
    res.status(200).json(getContact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteContactById = async (req, res) => {
  try {
    const contactId = req.params.id;

    //check if the id exists
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Delete the contact by ID
    const result = await Contact.findByIdAndDelete(contactId);

    console.log(`${result.deletedCount} contact deleted.`);
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
