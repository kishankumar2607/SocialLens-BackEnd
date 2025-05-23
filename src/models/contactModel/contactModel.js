const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    match: /^[a-zA-Z\s]*$/,
    minlength: [2, "First name must be at least 2 characters"],
    maxlength: [50, "First name cannot exceed 50 characters"],
  },
  LastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    match: /^[a-zA-Z\s]*$/,
    minlength: [2, "Last name must be at least 2 characters"],
    maxlength: [50, "Last name cannot exceed 50 characters"],
  },
  Email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  Mobile: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
  },
  Message: {
    type: String,
    required: true,
    trim: true,
    // validate: [
    //     {
    //         validator: function(value) {
    //             // Check if the message matches the allowed pattern
    //             return /^[a-zA-Z0-9\s]*$/.test(value);
    //         },
    //         message: props => `${props.value} is not a valid message.`
    //     },
    //     {
    //         validator: function(value) {
    //             // Check if the message contains any characters that might be used in SQL injection attacks
    //             return !value.includes("'") && !value.includes('"') && !value.includes(';');
    //         },
    //         message: props => `Message contains illegal characters.`
    //     }
    // ]
}

});

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
