const User = require("../../models/userModel/userModel");

// Get all accounts for a user
exports.getConnectedAccounts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      // accounts: user.accounts,
      phoneNumber: user.phoneNumber,
      phoneCountryCode: user.phoneCountryCode,
      emailNotification: user.notificationPreferences.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Get LinkedIn account details
exports.getLinkedInAccount = async (req, res) => {
  try {
    const linkedin = (req.user && req.user.accounts.linkedin) || {};
    const accountDetails = {
      id: linkedin.id || "",
      name: linkedin.name || "",
      profileURL: linkedin.profileURL || "",
      connected: linkedin.connected || false,
    };
    res.status(200).json({
      message: "LinkedIn account details retrieved successfully",
      accountDetails,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
