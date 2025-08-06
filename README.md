# 🔗 LinkedIn Integration Backend

This is the Node.js/Express backend for a social media scheduling tool. It allows users to:

- Authenticate using JWT
- Connect their LinkedIn accounts
- Post messages and images to LinkedIn
- View posts and comments
- Disconnect their LinkedIn account

---

## 📦 Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for user authentication
- **LinkedIn API** for posting and account linking
- **Multer** for image handling (in-memory)
- **Axios** for API requests

---

## 📁 Folder Structure

```
/backend
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
└── .env
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root and configure the following:

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

## 🚀 Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Run the server (dev mode)

```bash
npm run dev
```

Server will run on [http://localhost:8000](http://localhost:8000)

---

## 🔐 Auth Flow

- `auth_token` is stored in a cookie (or optionally sent via `Authorization` header).
- JWT is verified via `jwtAuth` middleware.
- LinkedIn integration is protected by `requireLinkedIn`.

---

## 📡 LinkedIn API Routes

| Method | Endpoint                          | Description                            |
|--------|-----------------------------------|----------------------------------------|
| GET    | /auth/linkedin                    | Start OAuth flow                       |
| GET    | /auth/linkedin/callback           | Handle LinkedIn callback               |
| POST   | /auth/linkedin/posts              | Create post with text + image          |
| GET    | /auth/linkedin/posts              | Get posts from LinkedIn                |
| GET    | /auth/linkedin/posts/:id/comments | Get comments for a post                |
| POST   | /auth/linkedin/posts/:id/comments | Comment on a post                      |
| DELETE | /auth/linkedin/unlink             | Disconnect LinkedIn account            |

---

## 🖼️ Image Upload

Images are uploaded using LinkedIn’s [UGC Media Upload API](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/ugc-post-api).  
Multer is used for in-memory upload of one image per post.

---

## 📦 API Request Sample (from frontend)

```js
const formData = new FormData();
formData.append("text", "Hello LinkedIn! #nodejs");
formData.append("image", file);

await fetch("/auth/linkedin/posts", {
  method: "POST",
  credentials: "include",
  body: formData,
});
```

---

## ✅ Middleware Overview

- `jwtAuth` → Authenticates the user via cookie or `Authorization` header.
- `requireLinkedIn` → Checks if the user has connected a LinkedIn account.
- `upload.single("image")` → Accepts one uploaded image per post.

---

## 📖 License

MIT License. Open to contributions and extensions.
