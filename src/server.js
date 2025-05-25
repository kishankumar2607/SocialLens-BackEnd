const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require("cors");
const createError = require("http-errors");
const allRoutes = require("./routes/mainRoutes");

const allowedOrigins = ["http://localhost:3000"];

// For app.use
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
