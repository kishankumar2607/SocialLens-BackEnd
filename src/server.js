const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require("cors");
const session = require("express-session");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const allRoutes = require("./routes/mainRoutes");

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );

// const allowedOrigins = ["http://localhost:3000"];

app.use(cors({
  origin: [
    'https://devsociallens.netlify.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "public", "images")));

// Session setup BEFORE passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// Default Router Message
app.get("/", (req, res, next) => {
  res.json("Welcome here...");
});

// All routes
app.use("/", allRoutes);

// For Throwing error about not found
app.use(async (req, res, next) => {
  next(createError.NotFound("This route does not exist"));
});

// Error Handler
app.use(async (error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});

// Export the Express API
module.exports = app;
