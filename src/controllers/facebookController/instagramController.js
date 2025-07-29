const axios = require("axios");
const User = require("../../models/userModel/userModel");

exports.getInstagramAnalytics = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user || !user.accounts.facebook.accessToken) {
			return res
				.status(401)
				.json({ message: "Facebook account not connected" });
		}
		// Find Instagram business account linked to Page
		const pageId = user.accounts.facebook.pageId;
		const pageRes = await axios.get(
			`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${user.accounts.facebook.accessToken}`
		);
		const instagramAccountId = pageRes.data.instagram_business_account.id;
		user.accounts.instagram = {
			connected: true,
			accessToken: user.accounts.facebook.accessToken, // same token
			userId: instagramAccountId,
			businessAccountId: instagramAccountId,
		};
		await user.save();

		// Get analytics
		const analyticsRes = await axios.get(
			`https://graph.facebook.com/v19.0/${instagramAccountId}/insights?metric=impressions,reach,profile_views&period=day&access_token=${user.accounts.facebook.accessToken}`
		);
		res.json({ analytics: analyticsRes.data.data });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
