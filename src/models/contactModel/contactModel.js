const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: [true, "Full name is requires"],
    trim: true,
    match: /^[a-zA-Z\s]*$/,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "First name cannot exceed 50 characters"],
  },

  Email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address",
    ],
    unique: true,
  },

  Message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
    minlength: [10, "Message must be at least 10 characters"],
    maxlength: [500, "Message cannot exceed 500 characters"],
  }
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
