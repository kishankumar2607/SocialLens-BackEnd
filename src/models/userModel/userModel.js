const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const isValidUrl = (url) => {
  try {
    const urlRegex =
      /^https?:\/\/([\w-]+\.)+[\w-]+\/[\w\-._~:/?#[\]@!$&'()*+,;=]+$/i;
    return url === "" || urlRegex.test(url);
  } catch (e) {
    return false;
  }
};

const accountField = {
  connected: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    default: "",
    trim: true,
    set: (v) => {
      if (v && !/^https?:\/\//i.test(v)) {
        return `https://${v}`;
      }
      return v;
    },
    validate: {
      validator: isValidUrl,
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    phoneCountryCode: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordCode: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    accounts: {
      instagram: accountField,
      twitter: accountField,
      facebook: accountField,
      linkedin: accountField,
    },
    tokens: [
      {
        token: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
