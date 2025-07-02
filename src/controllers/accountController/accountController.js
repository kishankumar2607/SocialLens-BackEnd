const User = require("../../models/userModel/userModel");

// Get all accounts for a user
exports.getConnectedAccounts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({
        accounts: user.accounts,
        phoneNumber: user.phoneNumber,
        phoneCountryCode: user.phoneCountryCode,
        emailNotification: user.notificationPreferences.email,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update one or more connected accounts
exports.updateConnectedAccounts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { accounts } = req.body;

    if (!accounts || typeof accounts !== "object") {
      return res.status(400).json({ message: "Invalid accounts format" });
    }

    const validPlatforms = ["instagram", "twitter", "facebook", "linkedin"];
    const updateData = {};

    for (const [platform, data] of Object.entries(accounts)) {
      if (validPlatforms.includes(platform) && typeof data === "object") {
        if ("connected" in data)
          updateData[`accounts.${platform}.connected`] = data.connected;
        if ("url" in data) updateData[`accounts.${platform}.url`] = data.url;
      }
    }

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No valid update data" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Accounts updated", accounts: updatedUser.accounts });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// Delete a connected account by platform
exports.deleteConnectedAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { platform } = req.params;
    const validPlatforms = ["instagram", "twitter", "facebook", "linkedin"];

    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ message: "Invalid platform" });
    }

    const updateData = {
      [`accounts.${platform}.connected`]: false,
      [`accounts.${platform}.url`]: "",
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `${platform} account disconnected successfully`,
      accounts: updatedUser.accounts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to disconnect account", error: error.message });
  }
};
