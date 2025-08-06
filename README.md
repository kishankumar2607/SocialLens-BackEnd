# 📱 SocialLens – Social Media Integration Backend

**SocialLens** is a scalable backend service built with Node.js and Express that allows users to create and manage social media posts across multiple platforms. Currently, it supports **LinkedIn**, and it is designed to integrate with **Twitter/X, Facebook, Instagram, YouTube, and TikTok** in the future.

---

## 🚀 Features

- 🔐 JWT-based authentication
- 🧠 LinkedIn integration using OAuth 2.0
- 🖼️ Image post upload to LinkedIn
- 📝 Comment fetching and posting
- 🔌 Planned support for multi-platform posting (coming soon)
- 📁 Clean, modular folder structure for easy extensibility

---

## 📦 Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** for auth
- **Multer** for image handling
- **Axios** for third-party API communication
- **LinkedIn API** for content posting
- Future: Support for **Twitter, Facebook, Instagram, TikTok, YouTube**

---

## 📁 Project Structure

```
/sociallens-backend
├── controllers/
│   └── linkedinController.js
├── middleware/
│   ├── jwtAuth.js
│   └── requireLinkedIn.js
├── models/
│   ├── User.js
│   └── LinkRequest.js
├── routes/
│   └── linkedinRoutes.js
├── config/
│   └── linkedin.js
│   └── asyncHandler.js
├── utils/
│   └── encryptDecryptData.js
├── app.js
├── server.js
└── .env
```

---

## ⚙️ Environment Setup

Create a `.env` file in the root:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret

# LinkedIn OAuth
CLIENT_ID=your_linkedin_client_id
CLIENT_SECRET=your_linkedin_client_secret
CALLBACK_URL=http://localhost:8000/auth/linkedin/callback
SCOPES=r_liteprofile r_emailaddress w_member_social
USERINFO_URL=https://api.linkedin.com/v2/me
AUTH_URL=https://www.linkedin.com/oauth/v2/authorization
TOKEN_URL=https://www.linkedin.com/oauth/v2/accessToken

FRONTEND_URL=http://localhost:3000
```

---

## 🧪 API Endpoints (LinkedIn)

| Method | Endpoint                          | Description                            |
|--------|-----------------------------------|----------------------------------------|
| GET    | /auth/linkedin                    | Start OAuth flow                       |
| GET    | /auth/linkedin/callback           | Handle OAuth redirect                  |
| POST   | /auth/linkedin/posts              | Create LinkedIn post (text + image)    |
| GET    | /auth/linkedin/posts              | Fetch user's LinkedIn posts            |
| GET    | /auth/linkedin/posts/:id/comments | Fetch comments on a post               |
| POST   | /auth/linkedin/posts/:id/comments | Add comment to LinkedIn post           |
| DELETE | /auth/linkedin/unlink             | Unlink LinkedIn account from profile   |

---

## 🖼️ Image Upload

Images are uploaded to LinkedIn via their UGC API. We use `multer.memoryStorage()` to accept in-memory file uploads.

---

## 🧠 Authentication Flow

- Users receive a **JWT** stored in cookies.
- Protected routes use the `jwtAuth` middleware.
- LinkedIn-authenticated users pass through `requireLinkedIn`.

---

## 📡 Frontend Integration Example

```js
const formData = new FormData();
formData.append("text", "Launching SocialLens 🚀 #tech");
formData.append("image", file);

await fetch("/auth/linkedin/posts", {
  method: "POST",
  credentials: "include",
  body: formData,
});
```

---

## 🔮 Future Roadmap

✅ LinkedIn  
🔲 Facebook  
🔲 Instagram  
🔲 X (Twitter)  
🔲 TikTok  
🔲 YouTube

---

## 🧩 Middleware Used

- `jwtAuth`: Validates the JWT from cookie or headers
- `requireLinkedIn`: Ensures LinkedIn token and URN are set
- `asyncHandler`: Wraps all route handlers to catch async errors
- `multer`: Handles image uploads

---

## 🛠️ Run the Project

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

App will run on: [http://localhost:8000](http://localhost:8000)

---

## 🤝 License

MIT License  
Open-source and ready to grow.

---

## 📧 Contact

Want to contribute or connect to another social media platform?  
Email: kishank2607@gmail.com
