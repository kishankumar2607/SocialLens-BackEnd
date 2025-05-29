const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

// Function to read the image file and create a Content-ID for it
const readImageFile = (filename) => {
  const filePath = path.join(__dirname, "images", filename);
  const data = fs.readFileSync(filePath);
  return {
    filename: filename,
    content: data,
    encoding: "base64",
    cid: `image-${filename}`,
  };
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendConfirmationEmail = async (contactData) => {
  // load your logo
  const logoImage = readImageFile("sociallens-logo.png");

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: contactData.email,
    subject: "Thank you for contacting SocialLens!",
    html: `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Password Reset</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f2f4f6; font-family:Arial,sans-serif;">
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center;">
            <img src="cid:${
              logoImage.cid
            }" alt="SocialLens Logo" style="max-width: 180px; margin-bottom: 20px;" />
        </div>
        <h2 style="color: #333;">Hi ${contactData.fullName},</h2>
        <p style="font-size: 16px; color: #555;">
            Thanks for reaching out to <strong>SocialLens</strong>. We’ve received your message and our team will respond shortly.
        </p>

        <h3 style="margin-top: 30px; color: #222;">Your Submission</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background-color: #eaeaea;">
            <th style="padding: 10px; text-align: left;">Field</th>
            <th style="padding: 10px; text-align: left;">Value</th>
            </tr>
            <tr>
            <td style="padding: 10px;">Name</td>
            <td style="padding: 10px;">${contactData.fullName}</td>
            </tr>
            <tr>
            <td style="padding: 10px;">Email</td>
            <td style="padding: 10px;">${contactData.email}</td>
            </tr>
            <tr>
            <td style="padding: 10px;">Message</td>
            <td style="padding: 10px;">
                      ${
                        contactData.message.length > 100
                          ? contactData.message.slice(0, 100) + "..."
                          : contactData.message
                      }
            </td>
            </tr>
        </table>

        <div style="margin-top: 30px; text-align: left;">
            <h3 style="color: #222;">What is SocialLens?</h3>
            <p style="font-size: 16px; color: #555; line-height: 26px;">
            SocialLens is your all-in-one platform for streamlining social media management, enhancing content visibility, and engaging meaningfully with your audience.
            </p>

            <h4 style="color: #222; margin-top: 20px;">Core Features:</h4>
            <ul style="color: #555; line-height: 24px; padding-left: 20px;">
            <li>📅 Smart Scheduling & Automation</li>
            <li>📈 Real-time Engagement Metrics</li>
            <li>📊 Cross-Platform Content Analytics</li>
            <li>💡 AI-based Caption & Hashtag Suggestions</li>
            </ul>

            <p style="font-size: 16px; color: #555; margin-top: 20px;">
            We'll be in touch soon, but if you have any urgent questions, feel free to reply to this email.
            </p>
        </div>

        <div style="margin-top: 30px; font-size: 14px; color: #999; text-align: center;">
            <p>Best Regards,<br /><strong>Kishan Kumar Das</strong><br />CEO & Founder, SocialLens</p>
            <p><a href="mailto:support@sociallens.io" style="color: #555; text-decoration: none;">support@sociallens.io</a></p>
            <p>Follow us on social media to stay updated!</p>
        </div>
        </div>
      </body>
    </html>
    `,
    attachments: [logoImage],
  };

  await transporter.sendMail(mailOptions);
};

// Function to send an email to yourself
const sendEmailToYourself = async (contactData) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: "New Contact Form Submission",
    html: `
       <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Password Reset</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f2f4f6; font-family:Arial,sans-serif;">
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
		<div style="font-family: 'Arial', sans-serif; text-align: center; padding: 20px;">
		  <h1 style="color: #4285f4;">New Contact Form Submission</h1>
		  <table style="width: 100%; border-collapse: collapse; text-align: left;">
			<tr style="background-color: #f2f2f2;">
			  <th style="padding: 10px; border: 1px solid #ddd;">Field</th>
			  <th style="padding: 10px; border: 1px solid #ddd;">Value</th>
			</tr>
			<tr style="text-align: left;">
			  <td style="padding: 10px; border: 1px solid #ddd;">First Name</td>
			  <td style="padding: 10px; border: 1px solid #ddd;">${
          contactData.fullName
        }</td>
			</tr>
			<tr style="text-align: left;">
			  <td style="padding: 10px; border: 1px solid #ddd;">Email</td>
			  <td style="padding: 10px; border: 1px solid #ddd;">${contactData.email}</td>
			</tr>
			<tr style="text-align: left;">
			  <td style="padding: 10px; border: 1px solid #ddd;">Message</td>
			  <td style="padding: 10px; border: 1px solid #ddd;">
          ${
            contactData.message.length > 100
              ? contactData.message.slice(0, 100) + "..."
              : contactData.message
          }
        </td>
			</tr>
		  </table>
		</div>
        </body>
    </html>
	  `,
  };

  await transporter.sendMail(mailOptions);
};

const sendSupportReplyEmail = async (supportData) => {
  // load your logo
  const logoImage = readImageFile("sociallens-logo.png");

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: supportData.email,
    subject: "We've received your support request – SocialLens Support",
    html: `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Support Request Received</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f2f4f6; font-family:Arial,sans-serif;">
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center;">
            <img src="cid:${
              logoImage.cid
            }" alt="SocialLens Logo" style="max-width: 180px; margin-bottom: 20px;" />
        </div>
        <h2 style="color: #333;">Hi ${supportData.fullName},</h2>
        <p style="font-size: 16px; color: #555;">
            Thank you for contacting <strong>SocialLens Support</strong>. We’ve received your request and our support team is reviewing it now. You can expect a reply from us shortly.
        </p>

        <h3 style="margin-top: 30px; color: #222;">Your Request Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background-color: #eaeaea;">
            <th style="padding: 10px; text-align: left;">Field</th>
            <th style="padding: 10px; text-align: left;">Value</th>
            </tr>
            <tr>
            <td style="padding: 10px;">Name</td>
            <td style="padding: 10px;">${supportData.fullName}</td>
            </tr>
            <tr>
            <td style="padding: 10px;">Email</td>
            <td style="padding: 10px;">${supportData.email}</td>
            </tr>
            <tr>
            <td style="padding: 10px;">Issue</td>
            <td style="padding: 10px;">
              ${
                supportData.issue.length > 100
                  ? supportData.issue.slice(0, 100) + "..."
                  : supportData.issue
              }
            </td>
            </tr>
        </table>

        <div style="margin-top: 30px; text-align: left;">
            <h3 style="color: #222;">While You Wait</h3>
            <p style="font-size: 16px; color: #555; line-height: 26px;">
              We recommend checking our Help Center for quick solutions to common questions. Our team is committed to resolving your issue as soon as possible.
            </p>
            <p style="font-size: 16px; color: #555;">
              In the meantime, feel free to reply to this email if you’d like to provide any additional information.
            </p>
        </div>

        <div style="margin-top: 30px; font-size: 14px; color: #999; text-align: center;">
            <p>Best Regards,<br /><strong>SocialLens Support Team</strong></p>
            <p><a href="mailto:support@sociallens.io" style="color: #555; text-decoration: none;">support@sociallens.io</a></p>
            <p>Follow us on social media to stay updated!</p>
        </div>
        </div>
      </body>
    </html>
    `,
    attachments: [logoImage],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendConfirmationEmail,
  sendEmailToYourself,
  sendSupportReplyEmail,
};
