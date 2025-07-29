const axios = require("axios");
const User = require("../../models/userModel/userModel");

exports.getFacebookPageAnalytics = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (
			!user ||
			!user.accounts.facebook.connected ||
			!user.accounts.facebook.accessToken
		) {
			return res
				.status(401)
				.json({ message: "Facebook account not connected" });
		}

		// Get user's pages
		const pagesRes = await axios.get(
			`https://graph.facebook.com/v19.0/me/accounts?access_token=${user.accounts.facebook.accessToken}`
		);
		const page = pagesRes.data.data[0];
		if (!page)
			return res.status(404).json({ message: "No Facebook Page found" });

		user.accounts.facebook.pageId = page.id;
		await user.save();

		// Get page insights
		const insightsRes = await axios.get(
			`https://graph.facebook.com/v19.0/${page.id}/insights?metric=page_impressions,page_engaged_users&page_access_token=${page.access_token}`
		);
		res.json({ analytics: insightsRes.data.data });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
