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
  id: {
    type: String,
    default: "",
    trim: true,
  },
  name: {
    type: String,
    default: "",
    trim: true,
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
  connected: {
    type: Boolean,
    default: false,
  },
  accessToken: {
    type: String,
    default: "",
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
      linkedin: accountField,
      // instagram: accountField,
      // twitter: accountField,
      // facebook: accountField,
    },
    notificationPreferences: {
      email: { type: Boolean, default: false },
      // sms: { type: Boolean, default: false },
      // push: { type: Boolean, default: false },
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
