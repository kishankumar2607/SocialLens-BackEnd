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

async function sendResetPasswordEmail(toEmail, resetCode) {
  // load your logo
  const logoImage = readImageFile("sociallens-logo.png");

  const mailOptions = {
    from: `"SocialLens Support" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Your SocialLens Password Reset Code",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Password Reset</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f2f4f6; font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:20px;">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                
                <!-- Logo bar -->
                <tr>
                  <td align="center" style="background-color:#1a202c; padding:30px;">
                    <img src="cid:${
                      logoImage.cid
                    }" width="80" alt="SocialLens Logo" style="display:block;" />
                  </td>
                </tr>
                
                <!-- Header -->
                <tr>
                  <td style="padding:30px; text-align:center;">
                    <h1 style="margin:0; font-size:24px; color:#333;">Password Reset Requested</h1>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding:0 30px 30px; color:#555; font-size:16px; line-height:1.5;">
                    <p>Hello,</p>
                    <p>We received a request to reset your SocialLens password. Use the code below to choose a new password. This code will expire in <strong>10 minutes</strong>.</p>
                    
                    <p style="text-align:center; margin:30px 0;">
                      <span style="font-size:32px; letter-spacing:4px; padding:10px 20px; background:#edf2f7; border-radius:4px; color:#2d3748; font-weight:bold;">
                        ${resetCode}
                      </span>
                    </p>
                    
                    <p>If you didn’t request a password reset, you can safely ignore this email.</p>
                    <p>Thanks,<br />The SocialLens Team</p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f7fafc; padding:20px; text-align:center; color:#718096; font-size:12px;">
                    <p style="margin:0;">© ${new Date().getFullYear()} SocialLens. All rights reserved.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    attachments: [logoImage],
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendResetPasswordEmail;
