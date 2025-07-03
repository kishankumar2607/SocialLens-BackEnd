const axios = require("axios");
const User = require("../../models/userModel/userModel");

// Function to make requests to LinkedIn API
const linkedInRequest = async (
  url,
  accessToken,
  method = "GET",
  data = null
) => {
  try {
    const config = {
      method,
      url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      },
      data,
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("LinkedIn API request failed:", error.message);
    if (error.response) {
      console.error("LinkedIn API error response data:", error.response.data);
      console.error("LinkedIn API error status:", error.response.status);
      console.error("LinkedIn API error headers:", error.response.headers);
    }
    throw new Error("LinkedIn API request failed");
  }
};

// Get LinkedIn profile information
exports.getLinkedInProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Check if user has a connected LinkedIn account
    if (
      !user ||
      !user.accounts.linkedin.connected ||
      !user.accounts.linkedin.accessToken
    ) {
      return res.status(404).json({
        message: "LinkedIn account not connected or access token missing.",
      });
    }

    // Fetch profile and email data from LinkedIn
    const profileData = await linkedInRequest(
      "https://api.linkedin.com/v2/me",
      user.accounts.linkedin.accessToken
    );

    // Fetch email address from LinkedIn
    const emailData = await linkedInRequest(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      user.accounts.linkedin.accessToken
    );

    //Send the profile and email data in the response
    res.status(200).json({
      profile: {
        id: profileData.id,
        firstName: profileData.localizedFirstName,
        lastName: profileData.localizedLastName,
        headline: profileData.headline,
        // profilePicture:
        //   profileData.profilePicture["displayImage~"].elements[0].identifiers[0]
        //     .identifier,
      },
      email: emailData.elements[0]["handle~"].emailAddress,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Get LinkedIn Followers
exports.getLinkedInFollowers = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Check if user has a connected LinkedIn account
    if (
      !user ||
      !user.accounts.linkedin.connected ||
      !user.accounts.linkedin.accessToken
    ) {
      return res.status(400).json({ message: "LinkedIn not connected" });
    }

    // Fetch LinkedIn profile to get user ID
    const profile = await linkedInRequest(
      "https://api.linkedin.com/v2/me",
      user.accounts.linkedin.accessToken
    );

    // Fetch followers count using the LinkedIn API
    const followers = await linkedInRequest(
      `https://api.linkedin.com/v2/networkSizes/urn:li:person:${profile.data.id}?edgeType=CompanyFollowedByMember`,
      user.accounts.linkedin.accessToken
    );

    // Check if followers data is available
    if (!followers || !followers.firstDegreeSize) {
      return res.status(404).json({ message: "No followers found" });
    }
    // Send the followers count in the response
    res.status(200).json({
      followers: followers.data.firstDegreeSize,
      message: "Followers fetched successfully",
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch followers" });
  }
};

//Post to LinkedIn feed
exports.createLinkedInPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Check if user has a connected LinkedIn account
    if (
      !user ||
      !user.accounts.linkedin.connected ||
      !user.accounts.linkedin.accessToken
    ) {
      return res
        .status(400)
        .json({ message: "LinkedIn account not connected." });
    }

    // Validate request body: Ensure text is provided
    if (
      !req.body.text ||
      typeof req.body.text !== "string" ||
      req.body.text.trim() === ""
    ) {
      return res.status(400).json({ message: "Post text is required." });
    }

    // Validate request body
    const profile = await linkedInRequest(
      "https://api.linkedin.com/v2/me",
      user.accounts.linkedin.accessToken
    );

    // Check if the post text is provided
    const postBody = {
      author: `urn:li:person:${profile.data.id}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: req.body.text },
          shareMediaCategory: "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };

    // Check if the post text is provided
    await linkedInRequest(
      "https://api.linkedin.com/v2/ugcPosts",
      user.accounts.linkedin.accessToken,
      "POST",
      postBody
    );

    // Send success response
    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating LinkedIn post:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create post", error: error.message });
  }
};
