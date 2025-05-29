const Support = require("../../models/supportModel/supportModel");
const SupportEmailService = require("../../helper/contactEmailService");

exports.postSupport = async (req, res) => {
  try {
    const newSupport = new Support(req.body);
    await newSupport.validate();
    await newSupport.save();

    await SupportEmailService.sendSupportReplyEmail(newSupport);

    res.status(201).json({ message: "Your support request has been submitted!" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = {};

      for (const key in error.errors) {
        let customerErrorMessage = "Validation Error";

        if ((key = "fullName")) {
          customerErrorMessage = "Name is required";
        } else if ((key = "email")) {
          customerErrorMessage = "Email is required";
        } else if ((key = "issue")) {
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

exports.getAllSupport = async (req, res) => {
  try {
    const getSupport = await Support.find();
    res.status(200).json(getSupport);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteSupportById = async (req, res) => {
  try {
    const SupportId = req.params.id;

    //check if the id exists
    const Support = await Support.findById(SupportId);
    if (!Support) {
      return res.status(404).json({ message: "Not found" });
    }

    // Delete the Support by ID
    const result = await Support.findByIdAndDelete(SupportId);

    console.log(`${result.deletedCount} contact deleted.`);
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
